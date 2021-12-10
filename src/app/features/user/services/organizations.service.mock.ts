import { Observable, of } from 'rxjs';
import { Organization } from '../models/organization';


export class MockOrganizationsService {
  getOrgUserName(id): string {
    return 'name';
  }

  getOrgName(id): string{
    return 'name';
  }

  getOrganization(): Observable <any>{
    return of(new Organization(
      1,
      'name',
      'description',
      []
    ));
  }

}
