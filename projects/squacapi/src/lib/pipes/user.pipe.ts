import { Pipe, PipeTransform } from "@angular/core";
import { OrganizationService } from "../services";

/**
 * Pipe for transforming user id into the user's "firstname lastname"
 */
@Pipe({
  name: "user",
  standalone: true,
})
export class UserPipe implements PipeTransform {
  constructor(private orgService: OrganizationService) {}

  /**
   * transforms user id into user's name
   *
   * @param value user id
   * @returns user's first and last name
   */
  transform(value: number | string): string {
    const id = +value;
    if (typeof value === "number" || !Number.isNaN(id)) {
      return this.orgService.getOrgUserName(id);
    }
    return value;
  }
}
