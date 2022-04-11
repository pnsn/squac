import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { SquacApiService } from "@core/services/squacapi.service";
import { MockSquacApiService } from "@core/services/squacapi.service.mock";
import { MetricsService } from "./metrics.service";
import { Metric } from "@core/models/metric";
import { fakeAsyncResponse } from "@core/utils/utils";

describe("MetricsService", () => {
  let metricsService: MetricsService;

  const testMetric: Metric = new Metric(
    1,
    1,
    "name",
    "code",
    "description",
    "reference",
    "unit",
    1
  );
  let squacApiService;

  const mockSquacApiService = new MockSquacApiService(testMetric);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: SquacApiService, useValue: mockSquacApiService }],
    });

    metricsService = TestBed.inject(MetricsService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it("should be created", () => {
    const service: MetricsService = TestBed.inject(MetricsService);

    expect(service).toBeTruthy();
  });

  it("should return all metrics", () => {
    metricsService.getMetrics().subscribe((metrics) => {
      expect(metrics).toBeTruthy();
    });
  });

  it("should get metric with id", (done: DoneFn) => {
    metricsService.getMetric(1).subscribe((metric) => {
      expect(metric.name).toEqual(testMetric.name);
      done();
    });
  });

  it("should update channel group", (done: DoneFn) => {
    metricsService.updateMetric(testMetric);

    metricsService.getMetric(1).subscribe((metric) => {
      expect(metric.name).toEqual(testMetric.name);
      done();
    });
  });

  it("should put metric with id", (done: DoneFn) => {
    const putSpy = spyOn(squacApiService, "put").and.callThrough();
    metricsService.updateMetric(testMetric).subscribe((metric) => {
      expect(putSpy).toHaveBeenCalled();
      done();
    });
  });

  it("should post metric without id", (done: DoneFn) => {
    const postSpy = spyOn(squacApiService, "post").and.callThrough();
    const newMetric = new Metric(
      null,
      1,
      "name",
      "code",
      "description",
      "reference",
      "unit",
      1
    );

    metricsService.updateMetric(newMetric).subscribe((metric) => {
      expect(postSpy).toHaveBeenCalled();
      done();
    });
  });
});
