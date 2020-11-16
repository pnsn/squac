import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '@core/guards/auth.guard';
import { PermissionGuard } from '@core/guards/permission.guard';
import { UserComponent } from './components/user/user.component';
import { UserResolver } from './user.resolver';
import { OrganizationComponent } from './components/organization/organization.component';
import { OrganizationResolver } from './organization.resolver';


// TODO: fix this weird routing set up
export const routes: Routes = [
  {
    path: '',
    resolve: {
      user: UserResolver
    },
    children: [
      {
        path: '',
        component: UserComponent
      },
      {
        path: 'organization/:orgId',
        canActivate: [AuthGuard],
        component: OrganizationComponent,
        resolve: {
          organization: OrganizationResolver
        }
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
