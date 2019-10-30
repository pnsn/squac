import { Threshold } from './threshold';

describe('Threshold', () => {
  it('should create an instance', () => {
    expect(new Threshold(
      1,
      1,
      1,
      1,
      1
    )).toBeTruthy();
  });
});
