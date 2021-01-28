import { Monitor } from './monitor';

describe('Monitor', () => {
  it('should create an instance', () => {
    expect(new Monitor(
      1,
      "name",
      1,
      1,
      "intervalType",
      1,
      1,
      "stat",
      1,
      []
    )).toBeTruthy();
  });
});
