import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { DateService } from "@core/services/date.service";
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";
import { DaterangepickerDirective } from "ngx-daterangepicker-material";

@Component({
  selector: "shared-date-select",
  templateUrl: "./date-select.component.html",
  styleUrls: ["./date-select.component.scss"],
})
export class DateSelectComponent implements OnInit {
  @ViewChild(DaterangepickerDirective, { static: true })
  pickerDirective: DaterangepickerDirective;
  @Output() datesChanged = new EventEmitter<any>();
  @Input() secondsAgoFromNow;
  @Input() initialStartDate;
  @Input() initialEndDate;
  @Input() timeRanges;
  startDate: dayjs.Dayjs;
  maxDate: dayjs.Dayjs;
  // settings for date select
  locale;
  ranges = {};

  selected: {
    startDate;
    endDate;
  };
  selectedRange;
  rangeSelected;
  rangesForDatePicker = {};
  liveMode: boolean;
  constructor(private dateService: DateService) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault("Etc/UTC");
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
      this.selected = {
        startDate: this.dateService.parseUtc(this.initialStartDate),
        endDate: this.dateService.parseUtc(this.initialEndDate),
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
    console.log("dates");
    if (dates.startDate && dates.endDate) {
      const startDate = this.dateService.correctForLocal(dates.startDate);
      const endDate = this.dateService.correctForLocal(dates.endDate);
      this.datesUpdated(startDate, endDate, false, null);
    }
  }

  datesUpdated(startDate, endDate, liveMode, rangeInSeconds) {
    this.datesChanged.emit({
      startDate,
      endDate,
      liveMode,
      rangeInSeconds,
    });
  }

  openDatePicker(e): void {
    this.pickerDirective.open(e);
  }
}
