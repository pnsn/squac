import { TestBed } from '@angular/core/testing';
import { UserContact } from './user-contact';
import { ApiGetNotification, UserNotification, UserNotificationAdapter } from './user-notification';

describe('Notification', () => {
  let adapter: UserNotificationAdapter;
  it('should create an instance', () => {
    expect(new UserNotification(
      1,
      'type',
      null,
      1
    )).toBeTruthy();
  });

  it('should adapt from api to notification', () => {
    adapter = TestBed.inject(UserNotificationAdapter);
    const testData: ApiGetNotification = {
      id: 1,
      url: 'string',
      notification_type: 'email', // email, sms, slack
      contact: {
        id: 1,
        url: 'string',
        email_value: 'string',
        sms_value: 'string',
        created_at: 'string',
        updated_at: 'string',
        user_id: '1',
        name: 'string'
      },
      level: 1, // 1, 2, 3
      created_at: 'string',
      updated_at: 'string',
      user_id: '1'
    };

    const notification = adapter.adaptFromApi(testData);
    expect(notification).toBeDefined();

  });

  it('should adapt from notification to api', () => {
    adapter = TestBed.inject(UserNotificationAdapter);
    const notification = new UserNotification(
      1,
      'email',
      new UserContact(1, '', '', ''),
      1
    );

    const notificationJson = adapter.adaptToApi(notification);
    expect(notificationJson).toBeDefined();
  });


});
