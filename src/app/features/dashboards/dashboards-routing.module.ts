import { NgModule } from '@angular/core';
import { DashboardsComponent } from './components/dashboards/dashboards.component';
import { DashboardEditComponent } from './components/dashboard-edit/dashboard-edit.component';
import { DashboardDetailComponent } from './components/dashboard-detail/dashboard-detail.component';
import { WidgetEditComponent } from '@features/widgets/components/widget-edit/widget-edit.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { PermissionGuard } from '@core/guards/permission.guard';
import { DashboardsResolver } from './dashboards.resolver'
import { WidgetsComponent } from '@features/widgets/components/widgets/widgets.component';
import { WidgetsResolver } from '@features/widgets/widgets.resolver';

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
        children: [
          {
            path: '', 
            redirectTo: 'widgets',
            pathMatch:'full'
          },
          {
            path:'widgets',
            component: WidgetsComponent,
            resolve: {
              widgets: WidgetsResolver
            },
            children: [
              // {
              //   path: 'new',
              //   component: WidgetEditComponent,
              //   canActivate: [PermissionGuard],
              //   data: {subject: 'Widget', action: 'create'}
              // },
              {
                path: ':widgetid',
                component: DashboardDetailComponent
              }
              // {
              //   path: ':widgetid/edit',
              //   component: WidgetEditComponent,
              //   canActivate: [PermissionGuard],
              //   data: {subject: 'Widget', action: 'update'}
              // },
            ]
          }
        ]
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
