import { NgModule } from '@angular/core';
import { DashboardsComponent } from './dashboards.component';
import { DashboardEditComponent } from './dashboard-edit/dashboard-edit.component';
import { DashboardDetailComponent } from './dashboard-detail/dashboard-detail.component';
import { WidgetEditComponent } from '../widgets/widget-edit/widget-edit.component';
import { WidgetComponent } from '../widgets/widget.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { PermissionGuard } from '../../core/guards/permission.guard';


export const routes: Routes = [
  {
    path: 'dashboards',
    component: DashboardsComponent,
    canActivate: [AuthGuard],
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
        children: [
          { path: 'widget',
            children: [
              {
                path: 'new',
                component: WidgetEditComponent,
                canActivate: [PermissionGuard],
                data: {subject: 'Widget', action: 'create'}
              },
              {
                path: ':widgetid',
                component: DashboardDetailComponent
              },
              {
                path: ':widgetid/edit',
                component: WidgetEditComponent,
                canActivate: [PermissionGuard],
                data: {subject: 'Widget', action: 'update'}
              },
            ]
          }
        ]
      },
      {
        path: ':id/edit',
        component: DashboardEditComponent,
        canActivate: [PermissionGuard],
        data: {subject: 'Dashboard', action: 'update'}},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardsRoutingModule { }
