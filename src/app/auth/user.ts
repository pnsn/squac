// Describes a user object
export class User {
  constructor(
    public email : string,
    private password: string, 
    public firstname: string,
    public lastname: string, 
    public is_staff : boolean,
    public organization: string,
    public groups: string[]
  ) {}
}
