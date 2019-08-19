import { User } from './user';

describe('User', () => {
  it('should create an instance', () => {
    expect(new User('','',new Date())).toBeTruthy();
  });

  it('should have a token if not expired', () => {
   let user = new User('','token',new Date());

   expect(user.token).toEqual('token');
  }) ;

  it('should not have a token if expired', () => {
    let user = new User('','token', new Date(10000));
 
    expect(user.token).toBeFalsy();
   }) ;
});
