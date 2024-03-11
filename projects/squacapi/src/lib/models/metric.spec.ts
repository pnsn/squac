import { Metric } from "./metric";

describe("Metric", () => {
  it("should create an instance", () => {
    expect(
      new Metric({
        default_maxval: 2,
      })
    ).toBeTruthy();
    expect(Metric.modelName).toBe("Metric");
  });

  it("should create new metric from api ", () => {
    const testData = {
      id: 1,
      name: "testName",
      code: "string",
      url: "string",
      description: "string",
      unit: "string",
      created_at: "string",
      updated_at: "string",
      default_minval: 2,
      default_maxval: 3,
      user: 1,
      reference_url: "string",
      sample_rate: 1,
    };
    const metric = new Metric(testData);
    expect(metric).toBeDefined();
    expect(metric.id).toBe(1);
    expect(metric.toJson()).toBeDefined();
  });
});
