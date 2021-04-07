import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '@core/guards/auth.guard';
import { PermissionGuard } from '@core/guards/permission.guard';
import { MetricsComponent } from './components/metrics/metrics.component';
import { MetricsResolver } from './metrics.resolver';
import { MetricsViewComponent } from './components/metrics-view/metrics-view.component';
import { MetricsEditComponent } from './components/metrics-edit/metrics-edit.component';


// TODO: fix this weird routing set up
export const routes: Routes = [
  { path: '',
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
        path: ':metricId/edit',
        component: MetricsEditComponent,
        canActivate: [PermissionGuard],
        data: {subject: 'Metric', action: 'update'},
        resolve: {
          metric: MetricsResolver
        },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetricsRoutingModule { }
