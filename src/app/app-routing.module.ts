import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './core/components/auth/auth.component';
import { AuthGuard } from './core/guards/auth.guard';
import { MetricsComponent } from '@features/metrics/components/metrics/metrics.component';
import { MetricsEditComponent } from '@features/metrics/components/metrics-edit/metrics-edit.component';
import { MetricsViewComponent } from '@features/metrics/components/metrics-view/metrics-view.component';
import { LoggedInGuard } from './core/guards/logged-in.guard';
import { UserComponent } from '@features/user/components/user/user.component';
import { PermissionGuard } from './core/guards/permission.guard';
import { PasswordResetComponent } from '@features/user/components/password-reset/password-reset.component';
import { LoginComponent } from '@features/user/components/login/login.component';
import { OrganizationComponent } from '@features/user/components/organization/organization.component';
import { UserEditComponent } from '@features/user/components/user-edit/user-edit.component';
import { UserResolver } from '@features/user/user.resolver';
import { OrganizationResolver } from '@features/user/organization.resolver';
import { MetricsResolver } from '@features/metrics/metrics.resolver';

// TODO:consider breaking into module for creation stuff
const appRoutes: Routes = [
  {
    path: 'password_reset/confirm', redirectTo: 'login/password-reset', pathMatch: 'full'
  },
  {
    path: 'login',
    component: AuthComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'password-reset',
        component: PasswordResetComponent
      }
    ]
  },
  {
    path: 'signup',
    component: AuthComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path: '',
        component: UserEditComponent
      }
    ]
  },
  { path: '', redirectTo: 'dashboards', pathMatch: 'full'},
  { path: 'user',
    canActivate: [AuthGuard],
    component: UserComponent,
    resolve: { 
      user: UserResolver
    }
  },

  { 
    path: 'organization',
    canActivate: [AuthGuard],
    component: OrganizationComponent,
    resolve: {
      organization: OrganizationResolver
    }
  },
  { path: 'metrics',
    component: MetricsComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {subject: 'Metric', action: 'read'},
    resolve: {
      metrics: MetricsResolver
    },
    children: [
      { path: '', component: MetricsViewComponent, pathMatch: 'full'},
      {
        path: 'new',
        component: MetricsEditComponent,
        canActivate: [PermissionGuard],
        data: {subject: 'Metric', action: 'create'}
      },
      // {
      //   path: ':id',
      //   component: MetricsViewComponent,
      //   canActivate: [PermissionGuard],
      //   data: {subject: 'Metric', action: 'read'}
      // },
      {
        path: ':id/edit',
        component: MetricsEditComponent,
        canActivate: [PermissionGuard],
        data: {subject: 'Metric', action: 'update'},
        resolve: {
          metric: MetricsResolver
        },
      },
    ]
  }
  // Currently overrides the child components - will need to rethink
  // { path: 'not-found', component: NotFoundComponent, pathMatch: 'full' },
  // { path: '**', redirectTo: 'not-found'}

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
