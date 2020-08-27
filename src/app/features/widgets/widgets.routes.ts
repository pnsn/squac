import { NgModule } from '@angular/core';
import { WidgetEditComponent } from '@features/widgets/components/widget-edit/widget-edit.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { PermissionGuard } from '@core/guards/permission.guard';
import { WidgetsComponent } from '@features/widgets/components/widgets/widgets.component';
import { WidgetsResolver } from '@features/widgets/widgets.resolver';
import { WidgetEditEntryComponent } from '@features/widgets/components/widget-edit/widget-edit-entry/widget-edit-entry.component';

export const widgetRoutes: Routes = [
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
      {
        path: 'new',
        component: WidgetEditEntryComponent,
        canActivate: [PermissionGuard],
        data: {subject: 'Widget', action: 'create'}
      },
      // {
      //   path: ':widgetid',
      //   component: DashboardDetailComponent
      // },
      {
        path: ':widgetid/edit',
        resolve: {
          widget: WidgetsResolver
        },
        component: WidgetEditEntryComponent,
        canActivate: [PermissionGuard],
        data: {subject: 'Widget', action: 'update'}
      },
    ]
  }
];
