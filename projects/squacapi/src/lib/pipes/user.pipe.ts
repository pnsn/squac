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
  transform(value: number): string {
    if (typeof value === "string") {
      return value;
    }
    return this.orgService.getOrgUserName(value);
  }
}
