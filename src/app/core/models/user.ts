// Describes a user object
export class User {
  constructor(
    public id: number,
    public email: string,
    public firstname: string,
    public lastname: string,
    private isStaff: boolean,
    public groups: string[]
  ) {

  }

  organization: string;
  
  isAdmin(): boolean {
    return this.isStaff;
  }

  inGroup(group: string): boolean {
    return this.groups.indexOf(group) >= 0;
  }
}
