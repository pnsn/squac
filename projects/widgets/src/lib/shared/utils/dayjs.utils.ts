import dayjs from "dayjs";
import { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(timezone);
dayjs.tz.setDefault("Etc/UTC");

export function parseUtc(date: string): Dayjs {
  return dayjs.utc(date).clone();
}

export const DEFAULT_LOCALE = {
  format: "YYYY-MM-DDTHH:mm:ss[Z]",
  displayFormat: "YYYY/MM/DD HH:mm",
  direction: "ltr",
};

export function format(date: Dayjs): string {
  return date.format(DEFAULT_LOCALE.format);
}
