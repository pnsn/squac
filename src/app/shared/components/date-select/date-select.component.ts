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
import { DateService } from "@core/services/date.service";
import * as dayjs from "dayjs";
import * as timezone from "dayjs/plugin/timezone";
import * as utc from "dayjs/plugin/utc";
import { DaterangepickerDirective } from "ngx-daterangepicker-material";
import { TimeRange } from "./time-range.interface";

@Component({
  selector: "shared-date-select",
  templateUrl: "./date-select.component.html",
  styleUrls: ["./date-select.component.scss"],
})
export class DateSelectComponent implements OnInit, OnChanges {
  @ViewChild(DaterangepickerDirective, { static: true })
  pickerDirective: DaterangepickerDirective;
  @Output() datesChanged = new EventEmitter<any>();
  @Input() secondsAgoFromNow: number;
  @Input() initialStartDate: string;
  @Input() initialEndDate: string;
  @Input() timeRanges: TimeRange[];
  startDate: dayjs.Dayjs;
  maxDate: dayjs.Dayjs;
  // settings for date select
  locale: any;
  ranges: any = {};

  selected: {
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
  };
  selectedRange: any;
  rangesForDatePicker: { [key: string]: [dayjs.Dayjs, dayjs.Dayjs] } = {};
  liveMode: boolean;

  constructor(private dateService: DateService) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault("Etc/UTC");
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.secondsAgoFromNow ||
      changes.initialEndDate ||
      changes.initialStartDate
    ) {
      this.setUpInitialValues();
    }
  }

  ngOnInit(): void {
    //config datepicker
    this.maxDate = this.dateService.now();
    this.startDate = this.dateService.now();
    this.makeTimeRanges();
    this.locale = this.dateService.locale;
    this.setUpInitialValues();
  }

  setUpInitialValues() {
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

  findRangeFromSeconds(seconds) {
    const range = this.timeRanges.find((range) => {
      const rangeInSeconds = this.getRangeAsSeconds(range);
      return rangeInSeconds === seconds;
    });

    return range;
  }

  getRangeAsSeconds(range) {
    return this.dateService.duration(range.amount, range.unit).asSeconds();
  }

  makeTimeRanges() {
    //range=[{ amount; unit}]
    this.timeRanges.forEach((range) => {
      this.rangesForDatePicker[range.amount + " " + range.unit] = [
        this.dateService.subtractFromNow(+range.amount, range.unit),
        this.startDate,
      ];
    });
  }

  toggleRange(event) {
    if (event.value !== "custom" && event.value !== "relative") {
      const range = event.value;
      const rangeInSeconds = this.getRangeAsSeconds(range);
      this.datesUpdated(null, null, true, rangeInSeconds);
    }
  }

  datePickerChange(dates: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs }) {
    if (dates.startDate && dates.endDate) {
      const startDate = this.dateService.fakeUtcFromLocal(dates.startDate);
      const endDate = this.dateService.fakeUtcFromLocal(dates.endDate);
      this.datesUpdated(startDate, endDate, false, null);
    }
  }

  /**
   *
   * @param startDate - dayjs date, start of time range
   * @param endDate - dayjs date, end of time range
   * @param liveMode - use live data
   * @param rangeInSeconds - width of time range in seconds
   */
  datesUpdated(
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
    liveMode: boolean,
    rangeInSeconds: number
  ) {
    this.datesChanged.emit({
      startDate,
      endDate,
      liveMode,
      rangeInSeconds,
    });
  }

  /**
   * Opens date picker
   * @param e - instance of event
   */
  openDatePicker(e): void {
    this.pickerDirective.open(e);
  }
}
