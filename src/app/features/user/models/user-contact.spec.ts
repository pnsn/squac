import { UserContact } from './user-contact';

describe('Contact', () => {
  it('should create an instance', () => {
    expect(new UserContact(
      1,
      'email',
      'sms',
      'name'
    )).toBeTruthy();
  });
});
