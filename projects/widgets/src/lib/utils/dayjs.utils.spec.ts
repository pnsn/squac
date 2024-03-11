import dayjs from "dayjs";
import { format, parseUtc } from "./dayjs.utils";

describe("dayjs utils", () => {
  it("should return given string date as a utc dayjs date", () => {
    const stringDate = "2022/01/01 00:00:00.000";
    const date = parseUtc(stringDate);
    expect(date.isUTC()).toBeTrue();
  });

  it("should format date with given format", () => {
    const date = dayjs("2022/01/01");
    const expectedFormattedDate = "2022-01-01T00:00:00Z";

    expect(format(date)).toBe(expectedFormattedDate);
  });
});
