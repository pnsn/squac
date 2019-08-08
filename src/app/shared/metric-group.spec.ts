import { MetricGroup } from './metric-group';

describe('Metric', () => {
  it('should create an instance', () => {
    expect(new MetricGroup("Test", "description")).toBeTruthy();
  });
});
