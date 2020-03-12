// Describes a user object
export class User {
  constructor(
    email : string,
    password: string, 
    firstname: string,
    lastname: string, 
    is_staff : boolean,
    organization: string,
    groups: string[]
  ) {}
}
