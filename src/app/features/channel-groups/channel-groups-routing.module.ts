import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ChannelGroupsComponent } from './components/channel-groups.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { PermissionGuard } from '@core/guards/permission.guard';
import { ChannelGroupsViewComponent } from './components/channel-groups-view/channel-groups-view.component';
import { ChannelGroupsEditComponent } from './components/channel-groups-edit/channel-groups-edit.component';
import {ChannelGroupsResolver} from './channel-groups.resolver';
import { ChannelGroupsDetailComponent } from './components/channel-groups-detail/channel-groups-detail.component';

//TODO: fix this weird routing set up
export const routes: Routes = [
  { path: 'channel-groups',
    component: ChannelGroupsComponent,
    canActivate: [AuthGuard],
    data: {subject: 'ChannelGroup', action: 'read'},
    resolve: {
      channelGroups:ChannelGroupsResolver
    },
    children: [
      {
        path: 'new',
        component: ChannelGroupsEditComponent,
        canActivate: [PermissionGuard],
        data: {subject: 'ChannelGroup', action: 'create'}
      },
      {
        path: ':id/edit',
        component: ChannelGroupsEditComponent,
        canActivate: [PermissionGuard],
        data: {subject: 'ChannelGroup', action: 'update'}
      },
      {
        path: '',
        component: ChannelGroupsViewComponent,
        canActivate: [PermissionGuard],
        data: {subject: 'ChannelGroup', action: 'read'},
        children: [ 
          {
            path: ':id',
            component: ChannelGroupsDetailComponent,
            canActivate: [PermissionGuard],
            data: {subject: 'ChannelGroup', action: 'update'},
            resolve: {
              channelGroup:ChannelGroupsResolver
            },
          }
        ]
      }

    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChannelGroupsRoutingModule { }
