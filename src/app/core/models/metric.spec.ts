import { TestBed } from "@angular/core/testing";
import { ApiGetMetric, Metric, MetricAdapter } from "./metric";

describe("Metric", () => {
  let adapter: MetricAdapter;
  it("should create an instance", () => {
    expect(
      new Metric(
        5,
        1,
        "name",
        "code",
        "description",
        "reference",
        "unit",
        1,
        1,
        10
      )
    ).toBeTruthy();
  });

  it("should create new metric from api ", () => {
    adapter = TestBed.inject(MetricAdapter);
    const testData: ApiGetMetric = {
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
    const metric = adapter.adaptFromApi(testData);
    expect(metric).toBeDefined();
    expect(metric.id).toBe(1);
  });

  it("should return api json from metric", () => {
    adapter = TestBed.inject(MetricAdapter);
    const testMetric: Metric = new Metric(
      1,
      1,
      "testName",
      "code",
      "description",
      "ref",
      "unit",
      1,
      2,
      1
    );
    const metricJson = adapter.adaptToApi(testMetric);
    expect(metricJson).toBeDefined();
    expect(metricJson.name).toBe("testName");
  });
});
