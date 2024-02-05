import { PrecisionPipe } from "./precision.pipe";

describe("PrecisionPipe", () => {
  it("create an instance", () => {
    const pipe = new PrecisionPipe();
    expect(pipe).toBeTruthy();
  });

  it("returns number with given precision", () => {
    const pipe = new PrecisionPipe();
    const value = 5.9999283844;
    const precision = 5;
    const expectedResult = "5.9999";

    const result = pipe.transform(value, precision);
    expect(result).toBe(expectedResult);
  });

  it("casts string to number and returns number with given precision", () => {
    const pipe = new PrecisionPipe();
    const value = "5.9999283844";
    const precision = 3;
    const expectedResult = "6.00";

    const result = pipe.transform(value, precision);
    expect(result).toBe(expectedResult);

    const badValue = "notanumber";
    const badResult = pipe.transform(badValue);
    expect(badResult).toBe("");
  });
});
