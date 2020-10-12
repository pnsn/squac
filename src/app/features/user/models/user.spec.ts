import { User } from './user';

describe('User', () => {
  it('should create an instance', () => {
    expect(new User(1, '', '', '', 1, false, [])).toBeTruthy();
  });

  it('should be an admin if isStaff', () => {
    const testUser = new User(1, '', '', '', 1, true, []);

    expect(testUser.isAdmin).toBeTruthy();

  });

  it('should check group', () => {
    const testUser = new User(1, '', '', '', 1, true,  ['manager', 'guest']);

    expect(testUser.inGroup('manager')).toBeTruthy();
    expect(testUser.inGroup('guest')).toBeTruthy();

    expect(testUser.inGroup('other')).toBeFalsy();
  });
});
