// Describes a user object
export class User {
  constructor(
    public email: string,
    private token: string,
    private tokenExpirationDate: Date
  ) {}

  public name;
  
  getToken() {
    if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
      return null;
    }
    return this.token;
  }

}
