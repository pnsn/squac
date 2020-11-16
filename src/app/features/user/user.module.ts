import { NgModule } from '@angular/core';
import { UserComponent } from '@features/user/components/user/user.component';
import { PasswordResetComponent } from '@features/user/components/password-reset/password-reset.component';
import { LoginComponent } from '@features/user/components/login/login.component';
import { OrganizationComponent } from '@features/user/components/organization/organization.component';
import { UserEditComponent } from '@features/user/components/user-edit/user-edit.component';

import { SharedModule } from '@shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { OrganizationsViewComponent } from './components/organizations-view/organizations-view.component';



@NgModule({
  declarations: [
    UserComponent,
    PasswordResetComponent,
    LoginComponent,
    OrganizationComponent,
    UserEditComponent,
    OrganizationsViewComponent
  ],
  imports: [
    SharedModule,
    UserRoutingModule
  ]
})
export class UserModule { }
