import { Pipe, PipeTransform } from "@angular/core";
import { OrganizationService } from "@features/user/services/organization.service";

@Pipe({
  name: "user",
})
export class UserPipe implements PipeTransform {
  constructor(private orgService: OrganizationService) {}

  transform(value: number): string {
    return this.orgService.getOrgUserName(value);
  }
}
