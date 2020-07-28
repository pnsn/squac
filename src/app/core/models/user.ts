// Describes a user object
export class User {


  constructor(
    public id: number,
    public email: string,
    public firstname: string,
    public lastname: string,
    public orgId: number,
    public orgAdmin: boolean,

  ) {

  }
  lastLogin: string;
  squacAdmin:boolean;
  isActive: boolean;
  groups: string[];

  get isStaff() : boolean{
    return this.squacAdmin ? this.squacAdmin : false;
  }

  get isAdmin(): boolean {
    return this.orgAdmin; //or is an admin of the current group?
  }

  inGroup(group: string): boolean {
    return this.groups ? this.groups.indexOf(group) >= 0 : false;
  }
}
