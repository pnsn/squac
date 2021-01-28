import { Alert } from './alert';

describe('Alert', () => {
  it('should create an instance', () => {
    expect(new Alert(
      1,
      1,
      1,
      'timestamp',
      'message',
      false
    )).toBeTruthy();
  });
});
