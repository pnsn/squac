import { NgModule } from "@angular/core";
import { MeasurementPipe } from "./pipes";
import { OrganizationPipe } from "./pipes/organization.pipe";
import { UserPipe } from "./pipes/user.pipe";

/**
 * Module for squacapi
 */
@NgModule({
  declarations: [],
  exports: [UserPipe, OrganizationPipe, MeasurementPipe],
  imports: [UserPipe, OrganizationPipe, MeasurementPipe],
})
export class SquacapiModule {}
