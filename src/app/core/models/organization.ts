// Describes a user object
export class Organization {
  constructor(
    public id: number,
    public name: string,
    public users: string[],
    public slug: string,
    public isActive: boolean
  ) {

  }
}
