import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupsComponent } from './groups/groups.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MetricsComponent } from './metrics/metrics.component';
import { MetricDetailComponent } from './metrics/metric-detail/metric-detail.component';
import { MetricsEditComponent } from './metrics/metrics-edit/metrics-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: DashboardComponent },
  { path: 'metrics', component: MetricsComponent,
    children: [
      { path: ':id', component: MetricDetailComponent},
      { path: ':id/edit', component: MetricsEditComponent },
    ]
  },
  { path: 'groups', component: GroupsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
