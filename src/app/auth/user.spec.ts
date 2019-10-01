import { User } from './user';

describe('User', () => {
  it('should create an instance', () => {
    expect(new User('', '', new Date())).toBeTruthy();
  });

  it('should have a token if not expired', () => {
    const dateInFuture = new Date((new Date()).getTime() + 100000);
    const user = new User('', 'token', dateInFuture);

    expect(user.token).toEqual('token');
  }) ;

  it('should not have a token if expired', () => {
    const user = new User('', 'token', new Date(10000));

    expect(user.token).toBeFalsy();
   }) ;
});
