import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ChannelGroupsComponent } from './components/channel-groups.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { PermissionGuard } from 'src/app/core/guards/permission.guard';
import { ChannelGroupsViewComponent } from './components/channel-groups-view/channel-groups-view.component';
import { ChannelGroupsEditComponent } from './components/channel-groups-edit/channel-groups-edit.component';

export const routes: Routes = [
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChannelGroupsRoutingModule { }
