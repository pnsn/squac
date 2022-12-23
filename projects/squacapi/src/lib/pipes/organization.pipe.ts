import { Pipe, PipeTransform } from "@angular/core";
import { OrganizationService } from "../services";

/**
 * Transforms organization id into an organization name
 */
@Pipe({
  name: "organization",
})
export class OrganizationPipe implements PipeTransform {
  constructor(private orgService: OrganizationService) {}

  /**
   * Transforms organization id into organization name
   *
   * @param value organization id
   * @returns organization name
   */
  transform(value: number): string {
    if (typeof value === "string") {
      return value;
    }
    return this.orgService.getOrgName(value);
  }
}
