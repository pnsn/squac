import { NgModule } from '@angular/core';
import { UserComponent } from '@features/user/components/user/user.component';
import { PasswordResetComponent } from '@features/user/components/password-reset/password-reset.component';
import { LoginComponent } from '@features/user/components/login/login.component';
import { OrganizationComponent } from '@features/user/components/organization/organization.component';
import { UserEditComponent } from '@features/user/components/user-edit/user-edit.component';
import { AbilityModule } from '@casl/angular';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ChannelGroupsRoutingModule } from '@features/channel-groups/channel-groups-routing.module';


@NgModule({
  declarations: [
    UserComponent,
    PasswordResetComponent,
    LoginComponent,
    OrganizationComponent,
    UserEditComponent
  ],
  imports: [
    AbilityModule,
    CommonModule,
    SharedModule,
    ChannelGroupsRoutingModule
  ],
  entryComponents: [

  ]
})
export class UserModule { }
