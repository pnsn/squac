import { NgModule } from "@angular/core";
import { OrganizationPipe } from "./pipes/organization.pipe";
import { UserPipe } from "./pipes/user.pipe";

/**
 * Module for squacapi
 */
@NgModule({
  declarations: [UserPipe, OrganizationPipe],
  exports: [UserPipe, OrganizationPipe],
  imports: [],
})
export class SquacapiModule {}
