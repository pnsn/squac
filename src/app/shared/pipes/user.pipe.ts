import { Pipe, PipeTransform } from '@angular/core';
import { OrganizationsService } from '@features/user/services/organizations.service';

@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {

  constructor(
    private orgService: OrganizationsService
  ) {}

  transform(value: number): string {
    return this.orgService.getOrgUserName(value);
  }


}
