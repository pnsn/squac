import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelGroupsComponent } from './channel-groups/channel-groups.component';
import { ChannelGroupsEditComponent } from './channel-groups/channel-groups-edit/channel-groups-edit.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { ChannelGroupsViewComponent } from './channel-groups/channel-groups-view/channel-groups-view.component';
import { MetricsComponent } from './metrics/metrics.component';
import { MetricsEditComponent } from './metrics/metrics-edit/metrics-edit.component';
import { MetricsViewComponent } from './metrics/metrics-view/metrics-view.component';
import { MetricsDetailComponent } from './metrics/metrics-detail/metrics-detail.component';
import { LoggedInGuard } from './auth/logged-in.guard';
import { UserComponent } from './auth/user/user.component';
import { PermissionGuard } from './auth/permission.guard';

// TODO:consider breaking into module for creation stuff
const appRoutes: Routes = [
  { path: 'login', component: AuthComponent, canActivate: [LoggedInGuard]},
  { path: '', redirectTo: 'dashboards', pathMatch: 'full'},
  { path: 'user', canActivate: [AuthGuard], component: UserComponent},
  { path: 'metrics',
    component: MetricsComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {subject: 'Metric', action: 'read'},
    children: [
      { path: '', component: MetricsViewComponent, pathMatch: 'full'},
      {
        path: 'new',
        component: MetricsEditComponent,
        canActivate: [PermissionGuard],
        data: {subject: 'Metric', action: 'create'}
      },
      {
        path: ':id',
        component: MetricsViewComponent,
        canActivate: [PermissionGuard],
        data: {subject: 'Metric', action: 'read'}
      },
      {
        path: ':id/edit',
        component: MetricsEditComponent,
        canActivate: [PermissionGuard],
        data: {subject: 'Metric', action: 'update'}
      },
    ]
  },
  { path: 'channel-groups',
    component: ChannelGroupsComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {subject: 'ChannelGroup', action: 'read'},
    children: [
      {
        path: '', component: ChannelGroupsViewComponent, pathMatch: 'full'
      },
      {
        path: 'new',
        component: ChannelGroupsEditComponent,
        canActivate: [PermissionGuard],
        data: {subject: 'ChannelGroup', action: 'create'}
      },
      {
        path: ':id',
        component: ChannelGroupsViewComponent,
        canActivate: [PermissionGuard],
        data: {subject: 'ChannelGroup', action: 'read'}
      },
      {
        path: ':id/edit',
        component: ChannelGroupsEditComponent,
        canActivate: [PermissionGuard],
        data: {subject: 'ChannelGroup', action: 'update'}
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
