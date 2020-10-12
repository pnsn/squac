import { NgModule } from '@angular/core';
import { DashboardsComponent } from './components/dashboards/dashboards.component';
import { DashboardEditComponent } from './components/dashboard-edit/dashboard-edit.component';
import { DashboardDetailComponent } from './components/dashboard-detail/dashboard-detail.component';
import { WidgetEditComponent } from '@features/widgets/components/widget-edit/widget-edit.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { PermissionGuard } from '@core/guards/permission.guard';
import { DashboardsResolver } from './dashboards.resolver';
import { widgetRoutes } from '@features/widgets/widgets.routes';
import { WidgetsResolver } from '@features/widgets/widgets.resolver';
import { WidgetEditEntryComponent } from '@features/widgets/components/widget-edit/widget-edit-entry/widget-edit-entry.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardsComponent,
    canActivate: [AuthGuard],
    resolve: {
      dashboards: DashboardsResolver
    },
    children: [
      {
        path: 'new',
        component: DashboardEditComponent,
        canActivate: [PermissionGuard],
        data: {subject: 'Dashboard', action: 'create'}
      },
      {
        path: ':id',
        component: DashboardDetailComponent,
        canActivate: [PermissionGuard],
        data: {subject: 'Dashboard', action: 'read'},
        resolve: {
          dashboard: DashboardsResolver
        },
        children: widgetRoutes
        // loadChildren: () => import('@features/widgets/widgets.module').then(m=>m.WidgetsModule)
      },
      {
        path: ':id/edit',
        component: DashboardEditComponent,
        canActivate: [PermissionGuard],
        data: {subject: 'Dashboard', action: 'update'},
        resolve: {
          dashboard: DashboardsResolver
        },
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardsRoutingModule { }
