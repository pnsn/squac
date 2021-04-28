import { Measurement } from './measurement';

describe('Measurement', () => {
  it('should create an instance', () => {
    expect(new Measurement(
      1,
      1,
      1,
      1,
      1,
      '',
      ''
    )).toBeTruthy();
  });
});
