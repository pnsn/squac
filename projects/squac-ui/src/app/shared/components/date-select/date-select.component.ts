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

@Component({
  selector: "shared-date-select",
  templateUrl: "./date-select.component.html",
  styleUrls: ["./date-select.component.scss"],
})
export class DateSelectComponent implements OnInit, OnChanges {
  @ViewChild(DaterangepickerDirective, { static: true })
  pickerDirective!: DaterangepickerDirective;
  @Output() datesChanged = new EventEmitter<any>();
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
    this.maxDate = this.dateService.now();
    this.startDate = this.dateService.now();
    this.locale = this.dateService.locale;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["secondsAgoFromNow"] ||
      changes["initialEndDate"] ||
      changes["initialStartDate"]
    ) {
      this.setUpInitialValues();
    }
  }

  ngOnInit(): void {
    //config datepicker
    this.makeTimeRanges();
    this.setUpInitialValues();
  }

  setUpInitialValues(): void {
    //has time range
    //range is saved as window_seconds on squacapi
    if (this.secondsAgoFromNow) {
      this.selectedRange = this.findRangeFromSeconds(this.secondsAgoFromNow);

      this.selected = {
        startDate: this.dateService.subtractFromNow(
          this.secondsAgoFromNow,
          "seconds"
        ),
        endDate: this.dateService.now(),
      };
      // has fixed start and end
    } else if (this.initialEndDate && this.initialStartDate) {
      //parse as local because datepicker refuses to show utc
      const startLocal = this.dateService.parse(this.initialStartDate);
      const endLocal = this.dateService.parse(this.initialEndDate);
      this.selected = {
        startDate: this.dateService.fakeLocalFromUtc(startLocal),
        endDate: this.dateService.fakeLocalFromUtc(endLocal),
      };
      this.selectedRange = "custom";
    } else {
      //no dates
    }
  }

  findRangeFromSeconds(seconds: number): TimeRange | undefined {
    const timeRange = this.timeRanges.find((range) => {
      const rangeInSeconds = this.getRangeAsSeconds(range);
      return rangeInSeconds === seconds;
    });

    return timeRange;
  }

  getRangeAsSeconds(range: TimeRange): number {
    return this.dateService.duration(range.amount, range.unit).asSeconds();
  }

  makeTimeRanges(): void {
    this.timeRanges.forEach((range) => {
      this.rangesForDatePicker[range.amount + " " + range.unit] = [
        this.dateService.subtractFromNow(+range.amount, range.unit),
        this.startDate,
      ];
    });
  }

  toggleRange(event: any): void {
    if (event.value !== "custom" && event.value !== "relative") {
      const range = event.value;
      const rangeInSeconds = this.getRangeAsSeconds(range);
      this.datesUpdated(null, null, true, rangeInSeconds);
    }
  }

  datePickerChange(dates: TimePeriod): void {
    const startCopy = dayjs(dates.startDate as Dayjs).clone();
    const endCopy = dayjs(dates.endDate as Dayjs).clone();
    if (dates.startDate && dates.endDate) {
      const startDate = this.dateService.fakeUtcFromLocal(startCopy);
      const endDate = this.dateService.fakeUtcFromLocal(endCopy);
      this.datesUpdated(startDate, endDate, false, null);
    }
  }

  datesUpdated(
    startDate: Dayjs | null,
    endDate: Dayjs | null,
    liveMode: boolean,
    rangeInSeconds: number | null
  ): void {
    this.datesChanged.emit({
      startDate,
      endDate,
      liveMode,
      rangeInSeconds,
    });
  }

  openDatePicker(e: any): void {
    this.pickerDirective.open(e);
  }
}
