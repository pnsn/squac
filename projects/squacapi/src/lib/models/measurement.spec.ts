import { Measurement } from "./measurement";

describe("Measurement", () => {
  it("should create an instance", () => {
    expect(new Measurement()).toBeTruthy();
    expect(Measurement.modelName).toBe("Measurement");
  });
});
