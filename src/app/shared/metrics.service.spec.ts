import { TestBed } from '@angular/core/testing';
import { MetricsService } from './metrics.service';
import { Metric } from './metric';

describe('MetricsService', () => {
  let httpClientSpy : { get : jasmine.Spy};
  let metricsService : MetricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // imports: [HttpClientTestingModule]
    })
    // httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    metricsService = TestBed.get(MetricsService);
  });

  it('should be created', () => {
    const service: MetricsService = TestBed.get(MetricsService);
    expect(service).toBeTruthy();
  });

  it('should return metrics', () => {
    expect(metricsService.getMetrics()).toBeTruthy();
  });

  it('should get metric from id', () => {
    expect(metricsService.getMetric(1)).toBeTruthy();
  });

  it('should add new metric', () => {
    const testMetric = new Metric(null, "metric a", "metric a description", "metricsource", "unit");

    const testID = metricsService.addMetric(testMetric);

    expect(metricsService.getMetric(testID)).toBeTruthy();
  });

  it('should update existing metric', () => {
    const testMetric = new Metric(1, "test", "metric a description", "metricsource", "unit");

    metricsService.updateMetric(1, testMetric);

    expect(metricsService.getMetric(1).name).toEqual("test");
  });

  it('should add new metric if no id', () => {
    const testMetric = new Metric(null, "test", "metric a description", "metricsource", "unit");

    const testID = metricsService.updateMetric(null, testMetric);

    expect(metricsService.getMetric(testID).name).toEqual("test");
  });
});
