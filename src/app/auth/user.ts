// Describes a user object
export class User {
  constructor(
    public email: string,
    private password: string,
    public firstname: string,
    public lastname: string,
    private isStaff: boolean,
    public organization: string,
    public groups: string[]
  ) {

  }


  isAdmin() : boolean {
    return this.isStaff;
  }

  inGroup(group : string) : boolean{
    return this.groups.indexOf(group) >= 0;
  }
}
