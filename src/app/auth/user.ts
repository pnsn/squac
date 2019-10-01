// Describes a user object
export class User {
  constructor(
    public email: string,
    private TOKEN: string,
    private tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
      return null;
    }
    return this.TOKEN;
  }

}
