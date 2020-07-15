
export class OrganizationUser{
  constructor(
    public orgUserId: number,
    public isAdmin: boolean,
    public orgId: number,
    public email: string,
    public firstname: string,
    public lastname: string,
    public id: number
  ) {

  }

  public organizationName : string;
}