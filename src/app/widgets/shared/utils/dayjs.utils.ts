import * as dayjs from "dayjs";
import * as duration from "dayjs/plugin/duration";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(timezone);
dayjs.tz.setDefault("Etc/UTC");

export function parseUtc(date: string): dayjs.Dayjs {
  return dayjs.utc(date).clone();
}
