import { NgModule } from "@angular/core";
import { UserComponent } from "@user/pages/main/user.component";
import { PasswordResetComponent } from "@user/components/password-reset/password-reset.component";
import { LoginComponent } from "@user/components/login/login.component";
import { OrganizationDetailComponent } from "@user/pages/organization-detail/organization-detail.component";
import { UserEditComponent } from "@user/pages/user-edit/user-edit.component";

import { SharedModule } from "@shared/shared.module";
import { UserRoutingModule } from "./user-routing.module";
import { OrganizationsViewComponent } from "./pages/organization-list/organizations-view.component";
import { UserSettingsComponent } from "./pages/user-settings/user-settings.component";
import { OrganizationEditComponent } from "./components/organization-edit/organization-edit.component";
import { OrganizationEditEntryComponent } from "./pages/organization-edit-entry/organization-edit-entry.component";
import { CommonModule } from "@angular/common";
import { TooltipModule } from "@ui/tooltip/tooltip.module";
import { LoadingDirective } from "@shared/directives/loading-directive.directive";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatOptionModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";

/**
 * Module for User feature
 */
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
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatOptionModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    CommonModule,
    SharedModule,
    UserRoutingModule,
    TooltipModule,
    LoadingDirective,
  ],
})
export class UserModule {}
