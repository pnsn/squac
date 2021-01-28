import { Trigger } from './trigger';

describe('Trigger', () => {
  it('should create an instance', () => {
    expect(new Trigger(
      1,
      1,
      false,
      1,
      1,
      0,
      1
    )).toBeTruthy();
  });
});
