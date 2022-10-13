import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MetricService } from "./metric.service";

describe("MetricService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ApiService, useValue: {} }],
    });
  });

  it("should be created", () => {
    const service: MetricService = TestBed.inject(MetricService);

    expect(service).toBeTruthy();
  });

  // it("should return all metrics", () => {
  //   metricService.getMetrics().subscribe((metrics) => {
  //     expect(metrics).toBeTruthy();
  //   });
  // });

  // it("should get metric with id", (done: DoneFn) => {
  //   metricService.getMetric(1).subscribe((metric) => {
  //     expect(metric.name).toEqual(testMetric.name);
  //     done();
  //   });
  // });

  // it("should update channel group", (done: DoneFn) => {
  //   metricService.updateMetric(testMetric);

  //   metricService.getMetric(1).subscribe((metric) => {
  //     expect(metric.name).toEqual(testMetric.name);
  //     done();
  //   });
  // });

  // it("should put metric with id", (done: DoneFn) => {
  //   const putSpy = spyOn(squacApiService, "put").and.callThrough();
  //   metricService.updateMetric(testMetric).subscribe(() => {
  //     expect(putSpy).toHaveBeenCalled();
  //     done();
  //   });
  // });

  // it("should post metric without id", (done: DoneFn) => {
  //   const postSpy = spyOn(squacApiService, "post").and.callThrough();
  //   const newMetric = new Metric(
  //     null,
  //     1,
  //     "name",
  //     "code",
  //     "description",
  //     "reference",
  //     "unit",
  //     1
  //   );

  //   metricService.updateMetric(newMetric).subscribe(() => {
  //     expect(postSpy).toHaveBeenCalled();
  //     done();
  //   });
  // });
});
