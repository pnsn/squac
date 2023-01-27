import { Measurement } from "../models";
import { MeasurementPipe } from "./measurement.pipe";
describe("MeasurementPipe", () => {
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

  it("create an instance", () => {
    const pipe = new MeasurementPipe();
    expect(pipe).toBeTruthy();
  });

  it("should return the average of the values", () => {
    const pipe = new MeasurementPipe();

    expect(pipe.transform(testValues, "ave")).toEqual(2);
  });

  it("should return the most recent value", () => {
    const pipe = new MeasurementPipe();

    expect(pipe.transform(testValues, "latest")).toEqual(2);
  });

  it("should return the minimum value", () => {
    const pipe = new MeasurementPipe();

    expect(pipe.transform(testValues, "min")).toEqual(1);
  });

  it("should return the maximum value", () => {
    const pipe = new MeasurementPipe();

    expect(pipe.transform(testValues, "max")).toEqual(3);
  });

  it("should return the count of the values", () => {
    const pipe = new MeasurementPipe();

    expect(pipe.transform(testValues, "num_samps")).toEqual(3);
  });

  it("should return the median of the values", () => {
    const pipe = new MeasurementPipe();

    expect(pipe.transform(testValues, "med")).toEqual(2);
  });

  it("should return the min abs value", () => {
    const pipe = new MeasurementPipe();

    expect(pipe.transform(testValues, "minabs")).toEqual(1);
  });

  it("should return the max abs value", () => {
    const pipe = new MeasurementPipe();

    expect(pipe.transform(testValues, "maxabs")).toEqual(3);
  });

  it("should return null if no values", () => {
    const pipe = new MeasurementPipe();

    expect(pipe.transform([], "min")).toBeNull();
  });
});
