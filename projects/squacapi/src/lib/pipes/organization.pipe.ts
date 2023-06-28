import { Pipe, PipeTransform } from "@angular/core";
import { OrganizationService } from "../services";

/**
 * Transforms organization id into an organization name
 */
@Pipe({
  name: "organization",
  standalone: true,
})
export class OrganizationPipe implements PipeTransform {
  constructor(private orgService: OrganizationService) {}

  /**
   * Transforms organization id into organization name
   *
   * @param value organization id
   * @returns organization name
   */
  transform(value: number | string): string {
    const id = +value;
    if (typeof value === "number" || !Number.isNaN(id)) {
      return this.orgService.getOrgName(id);
    }
    return value;
  }
}
