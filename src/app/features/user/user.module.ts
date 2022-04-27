import { NgModule } from "@angular/core";
import { UserComponent } from "@user/components/user/user.component";
import { PasswordResetComponent } from "@user/components/password-reset/password-reset.component";
import { LoginComponent } from "@user/components/login/login.component";
import { OrganizationDetailComponent } from "@user/components/organization-detail/organization-detail.component";
import { UserEditComponent } from "@user/components/user-edit/user-edit.component";

import { SharedModule } from "@shared/shared.module";
import { UserRoutingModule } from "./user-routing.module";
import { OrganizationsViewComponent } from "./components/organizations-view/organizations-view.component";
import { UserSettingsComponent } from "./components/user-settings/user-settings.component";
import { OrganizationEditComponent } from "./components/organization-edit/organization-edit.component";
import { OrganizationEditEntryComponent } from "./components/organization-edit-entry/organization-edit-entry.component";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    UserComponent,
    PasswordResetComponent,
    LoginComponent,
    OrganizationDetailComponent,
    UserEditComponent,
    OrganizationsViewComponent,
    UserSettingsComponent,
    OrganizationEditComponent,
    OrganizationEditEntryComponent,
  ],
  imports: [CommonModule, SharedModule, UserRoutingModule],
})
export class UserModule {}
