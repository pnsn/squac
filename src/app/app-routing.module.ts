import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupsComponent } from './groups/groups.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MetricGroupsComponent } from './metric-groups/metric-groups.component';
import { MetricGroupsDetailComponent } from './metric-groups/metric-groups-detail/metric-groups-detail.component';
import { MetricGroupsEditComponent } from './metric-groups/metric-groups-edit/metric-groups-edit.component';
import { GroupDetailComponent } from './groups/group-detail/group-detail.component';
import { GroupEditComponent } from './groups/group-edit/group-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: DashboardComponent },
  { path: 'metric-groups', component: MetricGroupsComponent,
    children: [
      { path: 'new', component: MetricGroupsEditComponent},
      { path: ':id', component: MetricGroupsDetailComponent},
      { path: ':id/edit', component: MetricGroupsEditComponent },
    ]
  },
  { path: 'groups', component: GroupsComponent,
    children: [
      { path: 'new', component: GroupEditComponent },
      { path: ':id', component: GroupDetailComponent},
      { path: ':id/edit', component: GroupEditComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
