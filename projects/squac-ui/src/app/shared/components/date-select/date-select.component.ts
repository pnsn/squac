import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { Locale } from "@core/locale.constant";
import { DateService } from "@core/services/date.service";
import dayjs, { Dayjs } from "dayjs";
import * as timezone from "dayjs/plugin/timezone";
import * as utc from "dayjs/plugin/utc";
import { DaterangepickerDirective } from "ngx-daterangepicker-material";
import { TimePeriod } from "ngx-daterangepicker-material/daterangepicker.component";
import { TimeRange } from "./time-range.interface";

/**
 * Date selector with two calendars
 */
@Component({
  selector: "shared-date-select",
  templateUrl: "./date-select.component.html",
  styleUrls: ["./date-select.component.scss"],
})
export class DateSelectComponent implements OnInit, OnChanges {
  @ViewChild(DaterangepickerDirective, { static: true })
  pickerDirective!: DaterangepickerDirective;
  @Output() datesChanged = new EventEmitter<any>();
  @Output() selectedRangeChanged = new EventEmitter<any>();
  @Input() secondsAgoFromNow: number | undefined;
  @Input() initialStartDate: string | undefined;
  @Input() initialEndDate: string | undefined;
  @Input() timeRanges: TimeRange[] = [];
  startDate: Dayjs;
  maxDate: Dayjs;
  // settings for date select
  locale: Locale;

  selected:
    | {
        startDate: Dayjs;
        endDate: Dayjs;
      }
    | undefined;
  selectedRange: any;
  rangesForDatePicker: Record<string, [Dayjs, Dayjs]> = {};
  liveMode: boolean | undefined;

  constructor(private dateService: DateService) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    this.maxDate = this.dateService.now().startOf("minute");
    this.startDate = this.dateService.now().startOf("minute");
    this.locale = this.dateService.locale;
  }

  /**
   * Init values on changes
   *
   * @param changes changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes["secondsAgoFromNow"] && this.secondsAgoFromNow) ||
      (changes["initialEndDate"] && this.initialEndDate) ||
      (changes["initialStartDate"] && this.initialStartDate)
    ) {
      this.setUpInitialValues();
    }
  }

  /**
   * Config datepicker
   */
  ngOnInit(): void {
    //config datepicker
    this.makeTimeRanges();
    this.setUpInitialValues();
  }

  /**
   * Set intial values for datepicker from time range or
   * start and end date
   */
  setUpInitialValues(): void {
    //has time range
    //range is saved as window_seconds on squacapi
    if (this.secondsAgoFromNow) {
      const selectedRange =
        this.findRangeFromSeconds(this.secondsAgoFromNow) ?? this.timeRanges[0];

      if (selectedRange && this.rangesForDatePicker[selectedRange.label]) {
        this.selected = {
          startDate: this.rangesForDatePicker[selectedRange.label][0],
          endDate: this.rangesForDatePicker[selectedRange.label][1],
        };
      }
      this.selectedRangeChanged.emit(selectedRange);
      // has fixed start and end
    } else if (this.initialEndDate && this.initialStartDate) {
      //parse as local because datepicker refuses to show utc
      const startLocal = this.dateService.parse(this.initialStartDate);
      const endLocal = this.dateService.parse(this.initialEndDate);
      this.selected = {
        startDate: this.dateService
          .fakeLocalFromUtc(startLocal)
          .startOf("minute"),
        endDate: this.dateService.fakeLocalFromUtc(endLocal).startOf("minute"),
      };
    }
  }

  /**
   * Finds TimeRange that is the same length as the given seconds
   *
   * @param seconds length of timerange
   * @returns Timerange if found
   */
  findRangeFromSeconds(seconds: number): TimeRange | undefined {
    const timeRange = this.timeRanges.find((range) => {
      const rangeInSeconds = this.getRangeAsSeconds(range);
      return rangeInSeconds === seconds;
    });

    return timeRange;
  }

  /**
   * Returns duration of time range in seconds
   *
   * @param range time range
   * @returns length of time range in seconds
   */
  getRangeAsSeconds(range: TimeRange): number {
    return this.dateService.duration(range.amount, range.unit).asSeconds();
  }

  /**
   * Creates time ranges for datepicker from time ranges
   */
  makeTimeRanges(): void {
    this.timeRanges.forEach((range) => {
      this.rangesForDatePicker[range.label] = [
        this.dateService
          .subtractFromNow(+range.amount, range.unit)
          .startOf("minute"),
        this.startDate,
      ];
    });
  }

  /**
   * Respond to date picker change event, correct for UTC
   * and send updated dates
   *
   * @param dates dates from selection
   */
  ngModelChange(dates: TimePeriod): void {
    if (dates && dates.startDate && dates.endDate) {
      const startCopy = dayjs(dates.startDate as Dayjs)
        .startOf("minute")
        .clone();
      const endCopy = dayjs(dates.endDate as Dayjs)
        .startOf("minute")
        .clone();

      if (endCopy && startCopy) {
        const seconds = this.dateService.diff(endCopy, startCopy, "seconds");
        const timeRange = this.findRangeFromSeconds(seconds);
        if (timeRange && endCopy.diff(this.startDate, "minute") < 1) {
          this.datesUpdated(null, null, true, seconds, timeRange);
        } else {
          const start = this.dateService.format(
            this.dateService.fakeUtcFromLocal(startCopy)
          );
          const end = this.dateService.format(
            this.dateService.fakeUtcFromLocal(endCopy)
          );
          this.datesUpdated(start, end, false);
          this.selectedRangeChanged.emit(null);
        }
      }
    }
  }

  /**
   * Emit updated date info
   *
   * @param startDate startdate
   * @param endDate enddate
   * @param liveMode is time range relative
   * @param rangeInSeconds width in seconds
   */
  datesUpdated(
    startDate: string | null,
    endDate: string | null,
    liveMode: boolean,
    rangeInSeconds?: number,
    range?: TimeRange
  ): void {
    // only emit if something has changed
    console.log(
      this.initialStartDate,
      endDate,
      rangeInSeconds,
      this.secondsAgoFromNow
    );
    if (
      (!rangeInSeconds &&
        (startDate !== this.initialStartDate ||
          endDate !== this.initialEndDate)) ||
      rangeInSeconds !== this.secondsAgoFromNow
    ) {
      this.datesChanged.emit({
        startDate,
        endDate,
        liveMode,
        rangeInSeconds,
      });
      this.selectedRangeChanged.emit(range);
    }
  }

  /**
   * Open html event for datepicker
   *
   * @param e html event
   */
  openDatePicker(e: any): void {
    this.pickerDirective.open(e);
  }
}
