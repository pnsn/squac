import { TestBed } from '@angular/core/testing';
import { ApiGetUser, User, UserAdapter } from './user';

describe('User', () => {
  let adapter: UserAdapter;
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

  it('should adapt from api to user', () => {
    adapter = TestBed.inject(UserAdapter);
    const testData: ApiGetUser = {
      email: 'string',
      firstname: 'string',
      lastname: 'string',
      is_staff: false,
      groups: [1],
      id: 1,
      organization: 1,
      is_org_admin: false,
      last_login: 'string',
      is_active: true
    };

    const user = adapter.adaptFromApi(testData);
    expect(user).toBeDefined();
  });

  it('should adapt to api from user', () => {
    adapter = TestBed.inject(UserAdapter);

    const user = new User(
      1,
      'eamuil',
      '',
      '',
      1,
      false,
      []
    );

    const userJson = adapter.adaptToApi(user);
    expect(userJson).toBeDefined();
  });


});
