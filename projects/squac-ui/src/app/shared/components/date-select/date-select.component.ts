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
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { DEFAULT_LOCALE } from "@core/constants/locale.constant";
import { DateService } from "@core/services/date.service";
import dayjs from "dayjs";
import * as timezone from "dayjs/plugin/timezone";
import * as utc from "dayjs/plugin/utc";
import {
  DaterangepickerDirective,
  LocaleService,
  LOCALE_CONFIG,
  NgxDaterangepickerMd,
} from "ngx-daterangepicker-material";
import { TimeRange } from "./time-range.interface";

/** Describes the data outputted by the date select */
export interface TimePeriod {
  [index: string]: dayjs.Dayjs;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
}

/**
 * Date selector with two calendars
 */
@Component({
  selector: "shared-date-select",
  templateUrl: "./date-select.component.html",
  standalone: true,
  providers: [
    { provide: LOCALE_CONFIG, useValue: DEFAULT_LOCALE },
    LocaleService,
  ],
  imports: [
    NgxDaterangepickerMd,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
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
  startDate: dayjs.Dayjs;
  maxDate: dayjs.Dayjs;
  firstLoad = true; // only take external input changes on first load

  selected:
    | {
        startDate: dayjs.Dayjs;
        endDate: dayjs.Dayjs;
      }
    | undefined;
  selectedRange: any;
  rangesForDatePicker: Record<string, [dayjs.Dayjs, dayjs.Dayjs]> = {};
  liveMode: boolean | undefined;

  constructor(private dateService: DateService) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    this.maxDate = this.dateService.now().startOf("minute");
    this.startDate = this.dateService.now().startOf("minute");
  }

  /**
   * Init values on changes
   *
   * @param changes changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.firstLoad &&
      ((changes["secondsAgoFromNow"] && this.secondsAgoFromNow) ||
        (changes["initialEndDate"] && this.initialEndDate) ||
        (changes["initialStartDate"] && this.initialStartDate))
    ) {
      this.setUpInitialValues();
      this.firstLoad = false;
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
    if (this.secondsAgoFromNow) {
      //has time range
      //range is saved as window_seconds on squacapi
      const selectedRange =
        this.dateService.findRangeFromSeconds(
          this.timeRanges,
          this.secondsAgoFromNow
        ) ?? this.timeRanges[0];

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
      const start = this.dateService.parse(this.initialStartDate);
      const end = this.dateService.parse(this.initialEndDate);

      // shift date by UTC offset because datepicker forces it to show
      // local, but still uses UTC internally
      const startDate = this.dateService.subtractUtcOffset(start).utc();
      const endDate = this.dateService.subtractUtcOffset(end).utc();

      this.selected = {
        startDate,
        endDate,
      };

      this.selectedRangeChanged.emit(null);
    }
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
    //on first load the date needs to be shifted, but not after??
    if (dates && dates.startDate && dates.endDate) {
      //even though it shows "local", output dates are UTC
      let startCopy = dayjs(dates.startDate as dayjs.Dayjs)
        .startOf("minute")
        .clone();
      let endCopy = dayjs(dates.endDate as dayjs.Dayjs)
        .startOf("minute")
        .clone();

      if (startCopy.isUTC()) {
        // datepicker uses local time, but we want users to think
        // its UTC, so values need to be adjusted to UTC
        startCopy = this.dateService.addUtcOffset(startCopy);
        endCopy = this.dateService.addUtcOffset(endCopy);
      }

      if (endCopy && startCopy) {
        //calculate difference in start & end
        const diff = this.dateService.diff(endCopy, startCopy, "seconds");
        const timeRange = this.dateService.findRangeFromSeconds(
          this.timeRanges,
          diff
        );
        // if the diff matches a timerange, check if the
        // startDate is "close enough" to now
        if (timeRange && endCopy.diff(Date.now(), "day") > -1) {
          this.datesUpdated(null, null, true, diff, timeRange);
        } else {
          // no time range found, use start and end times
          const start = this.dateService.format(startCopy);
          const end = this.dateService.format(endCopy);
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
   * @param rangeInSeconds width in seconds,
   * @param range selected time range
   */
  datesUpdated(
    startDate: string | null,
    endDate: string | null,
    liveMode: boolean,
    rangeInSeconds?: number,
    range?: TimeRange
  ): void {
    // only emit if something has changed
    if (
      (!rangeInSeconds &&
        (startDate !== this.initialStartDate ||
          endDate !== this.initialEndDate)) ||
      (!startDate && !endDate && rangeInSeconds !== this.secondsAgoFromNow)
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
