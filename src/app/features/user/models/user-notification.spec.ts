import { UserNotification } from './user-notification';

describe('Notification', () => {
  it('should create an instance', () => {
    expect(new UserNotification(
      1,
      "type",
      null,
      1
    )).toBeTruthy();
  });
});
