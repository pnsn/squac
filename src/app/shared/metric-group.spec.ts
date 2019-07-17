import { MetricGroup } from './metric-group';

describe('Metric', () => {
  it('should create an instance', () => {
    expect(new MetricGroup(1, "Test")).toBeTruthy();
  });
});
