import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { MetricGroupsComponent } from './metric-groups/metric-groups.component';
import { MetricGroupsDetailComponent } from './metric-groups/metric-groups-detail/metric-groups-detail.component';
import { MetricGroupsEditComponent } from './metric-groups/metric-groups-edit/metric-groups-edit.component';
import { ChannelGroupsComponent } from './channel-groups/channel-groups.component';
import { ChannelGroupsEditComponent } from './channel-groups/channel-groups-edit/channel-groups-edit.component';
import { ChannelGroupsDetailComponent } from './channel-groups/channel-groups-detail/channel-groups-detail.component';
import { DashboardEditComponent } from './dashboards/dashboard-edit/dashboard-edit.component';
import { DashboardDetailComponent } from './dashboards/dashboard-detail/dashboard-detail.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboards', pathMatch: 'full'},
  { path: 'login', component: AuthComponent},
  { path: 'dashboards', component: DashboardsComponent,
    children: [
      { path: 'new', component: DashboardEditComponent},
      { path: ':id', component: DashboardDetailComponent},
      { path: ':id/edit', component: DashboardEditComponent },
    ]
  },
  { path: 'metric-groups', component: MetricGroupsComponent,
    children: [
      { path: 'new', component: MetricGroupsEditComponent},
      { path: ':id', component: MetricGroupsDetailComponent},
      { path: ':id/edit', component: MetricGroupsEditComponent },
    ]
  },
  { path: 'channel-groups', component: ChannelGroupsComponent,
  children: [
    { path: 'new', component: ChannelGroupsEditComponent},
    { path: ':id', component: ChannelGroupsDetailComponent},
    { path: ':id/edit', component: ChannelGroupsEditComponent },
  ]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
