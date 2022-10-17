import { NgModule } from "@angular/core";
import { MeasurementPipe } from "./pipes/measurement.pipe";
import { OrganizationPipe } from "./pipes/organization.pipe";
import { UserPipe } from "./pipes/user.pipe";

@NgModule({
  declarations: [UserPipe, OrganizationPipe, MeasurementPipe],
  exports: [UserPipe, OrganizationPipe, MeasurementPipe],
  imports: [],
})
export class SquacapiModule {}
