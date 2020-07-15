import { OrganizationUser } from './organization-user';

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

  orgUsers: OrganizationUser[];

  isAdmin(): boolean {
    return this.isStaff; //or is an admin of the current group?
  }

  inGroup(group: string): boolean {
    return this.groups.indexOf(group) >= 0;
  }
}
