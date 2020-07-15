import { OrganizationUser } from './organization-user';

// Describes a user object
export class Organization {
  constructor(
    public id: number,
    public name: string,
    public users: OrganizationUser[],
    public slug: string,
    public isActive: boolean
  ) {

  }
}
