import { Injectable } from "@angular/core";

//used to take widget data and transform to different formas
@Injectable()
export class WidgetTypeService {
  constructor() {}

  timeAxisFormatToolTip(params) {
    let data = [];
    if (Array.isArray(params)) {
      data = [...params];
    } else {
      data.push(params);
    }
    let str = "";

    if (data[0].axisValueLabel) {
      str += data[0].axisValueLabel;
    } else {
      str += this.timeAxisPointerLabelFormatting({ value: data[0].value[1] });
    }

    str += "<br />";
    data.forEach((param) => {
      const name = param.name ? param.name : param.seriesName;
      str += param.marker + " " + name + " " + param.value[3] + "<br />";
    });

    return str;
  }

  timeAxisTickFormatting(val) {
    const value = new Date(val);
    let formatOptions;
    if (value.getSeconds() !== 0) {
      formatOptions = { second: "2-digit" };
    } else if (value.getMinutes() !== 0) {
      formatOptions = { hour: "2-digit", minute: "2-digit" };
    } else if (value.getHours() !== 0) {
      formatOptions = { hour: "2-digit", minute: "2-digit" };
    } else if (value.getDate() !== 1) {
      formatOptions =
        value.getDay() === 0
          ? { month: "short", day: "2-digit" }
          : { month: "short", day: "2-digit" };
    } else if (value.getMonth() !== 0) {
      formatOptions = { month: "long" };
    } else {
      formatOptions = { year: "numeric" };
    }
    formatOptions.hour12 = false;
    formatOptions.timeZone = "UTC";
    const string = new Intl.DateTimeFormat("en-US", formatOptions).format(
      value
    );
    return string;
  }

  timeAxisPointerLabelFormatting(val) {
    const value = new Date(val.value);
    let formatOptions = {};
    formatOptions = {
      //have to reassign it this way or linter won't allow it set
      second: "2-digit",
      minute: "2-digit",
      hour: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
      timeZone: "UTC",
    };
    if (value) {
      const string = new Intl.DateTimeFormat("en-US", formatOptions).format(
        value
      );
      return string;
    }
  }

  //calculate y axis position to prevent overlap
  yAxisLabelPosition(min, max): number {
    const minLen = (Math.round(min * 10) / 10).toString().length;
    const maxLen = (Math.round(max * 10) / 10).toString().length;
    return Math.max(minLen, maxLen) * 10 + 5;
  }
}
