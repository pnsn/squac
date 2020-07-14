// Describes a user object
export class User {
  constructor(
    public id: number,
    public name: string,
    public users: string[],
    public slug: string
  ) {

  }
}
