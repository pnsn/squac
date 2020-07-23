import { User } from './user';

// Describes a user object
export class Organization {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public users: User[]
  ) {

  }
}
