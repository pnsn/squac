import { Metric } from './metric';

describe('Metric', () => {
  it('should create an instance', () => {
    expect(new Metric(
      5,
      "name",
      "description",
      "source",
      "unit"
    )).toBeTruthy();
  });
});
