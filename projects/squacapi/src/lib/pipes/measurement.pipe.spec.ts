import { Measurement } from "../models";
import { MeasurementPipe } from "./measurement.pipe";
describe("MeasurementPipe", () => {
  let pipe: MeasurementPipe;
  const testValues: Measurement[] = [
    new Measurement({
      value: 1,
      starttime: "2020-12-01T18:43:59.780000Z",
      id: 1,
      user: 2,
      endtime: "2020-12-01T18:43:59.780000Z",
      metric: 1,
      channel: 1,
    }),
    new Measurement({
      value: 3,
      starttime: "2020-12-02T18:43:59.780000Z",
      id: 1,
      user: 2,
      endtime: "2020-12-01T18:43:59.780000Z",
      metric: 1,
      channel: 1,
    }),
    new Measurement({
      value: 2,
      starttime: "2020-12-03T18:43:59.780000Z",
      id: 1,
      user: 2,
      endtime: "2020-12-01T18:43:59.780000Z",
      metric: 1,
      channel: 1,
    }),
  ];

  beforeEach(() => {
    pipe = new MeasurementPipe();
  });

  it("create an instance", () => {
    expect(pipe).toBeTruthy();
  });

  it("should return the average measurement value", () => {
    const ave = 2;
    expect(pipe.transform(testValues, "ave")).toBe(ave);
    expect(pipe.transform(testValues, "avg")).toBe(ave);
    expect(pipe.transform(testValues, "mean")).toBe(ave);
  });

  it("should return the minimum value", () => {
    const min = 1;
    expect(pipe.transform(testValues, "min")).toBe(min);
  });

  it("should return the maximum value", () => {
    const max = 3;
    expect(pipe.transform(testValues, "max")).toBe(max);
  });

  it("should return the count of the values", () => {
    const count = testValues.length;

    expect(pipe.transform(testValues, "count")).toBe(count);
    expect(pipe.transform(testValues, "num_samps")).toBe(count);
  });

  it("should return the median of the values", () => {
    const med = 2;

    expect(pipe.transform(testValues, "med")).toBe(med);
    expect(pipe.transform(testValues, "median")).toBe(med);

    // even # of measuyrements should use the middle of the two values
    expect(
      pipe.transform(
        [
          ...testValues,
          new Measurement({
            value: 5,
            starttime: "2020-12-03T18:43:59.780000Z",
            id: 1,
            user: 2,
            endtime: "2020-12-01T18:43:59.780000Z",
            metric: 1,
            channel: 1,
          }),
        ],
        "med"
      )
    ).toBe(2.5);
  });

  it("should return the most recent value", () => {
    const latest = 2;
    expect(pipe.transform(testValues, "recent")).toBe(latest);
    expect(pipe.transform(testValues, "latest")).toBe(latest);
  });

  it("should return the min abs value", () => {
    const minAbs = 1;
    expect(pipe.transform(testValues, "minabs")).toBe(minAbs);
  });

  it("should return the max abs value", () => {
    const maxAbs = 3;
    expect(pipe.transform(testValues, "maxabs")).toBe(maxAbs);
  });

  it("should return the sum of the values", () => {
    const sum = 6;
    expect(pipe.transform(testValues, "sum")).toBe(sum);
  });

  it("should find correct or closest percentiles", () => {
    // small # of values
    expect(pipe.transform(testValues, "p05")).toBe(2);
    expect(pipe.transform(testValues, "p10")).toBe(2);
    expect(pipe.transform(testValues, "p90")).toBe(3);
    expect(pipe.transform(testValues, "p95")).toBe(3);

    const measurements = new Array<Measurement>(100);
    const values = [];
    for (let i = 0; i < 100; i++) {
      values.push(Math.round(Math.random() * 100 - 50));
      measurements[i] = new Measurement({
        value: values[i],
        starttime: `2020-12-02T18:43:59.00Z`,
        id: 1,
        user: 2,
        endtime: "2020-12-01T18:43:59.780000Z",
        metric: 1,
        channel: 1,
      });
    }
    values.sort((a, b) => a - b);
    expect(pipe.transform(measurements, "p05")).toBe(values[5]);
    expect(pipe.transform(measurements, "p10")).toBe(values[10]);
    expect(pipe.transform(measurements, "p90")).toBe(values[90]);
    expect(pipe.transform(measurements, "p95")).toBe(values[95]);
  });

  it("should return null if no values", () => {
    const pipe = new MeasurementPipe();
    expect(pipe.transform([], "min")).toBeNull();
  });
});
