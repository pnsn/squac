import { NgModule } from '@angular/core';
import { DashboardsComponent } from './dashboards.component';
import { DashboardEditComponent } from './dashboard-edit/dashboard-edit.component';
import { DashboardDetailComponent } from './dashboard-detail/dashboard-detail.component';
import { WidgetEditComponent } from '../widgets/widget-edit/widget-edit.component';
import { WidgetComponent } from '../widgets/widget.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';


export const routes: Routes = [
  {
    path: 'dashboards',
    component: DashboardsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'new', component: DashboardEditComponent},
      { path: ':id',
        component: DashboardDetailComponent,
        children: [
          { path: 'widget',
            children: [
              { path: 'new', component: WidgetEditComponent},
              { path: ':widgetid', component: DashboardDetailComponent},
              { path: ':widgetid/edit', component: WidgetEditComponent },
            ]
          }
        ]
      },
      { path: ':id/edit', component: DashboardEditComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardsRoutingModule { }
