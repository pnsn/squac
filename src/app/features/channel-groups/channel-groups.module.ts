import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { ChannelGroupsComponent } from './components/channel-groups.component';
import { ChannelGroupsEditComponent } from './components/channel-groups-edit/channel-groups-edit.component';
import { ChannelGroupsViewComponent } from './components/channel-groups-view/channel-groups-view.component';
import { ChannelGroupsFilterComponent } from './components/channel-groups-edit/channel-groups-filter/channel-groups-filter.component';
import { ChannelGroupsRoutingModule } from './channel-groups-routing.module';
import { ChannelGroupsDetailComponent } from './components/channel-groups-detail/channel-groups-detail.component';

@NgModule({
  declarations: [
    ChannelGroupsComponent,
    ChannelGroupsEditComponent,
    ChannelGroupsViewComponent,
    ChannelGroupsFilterComponent,
    ChannelGroupsDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ChannelGroupsRoutingModule
  ],
  exports: [
  ],
  entryComponents: [
  ]
})
export class ChannelGroupsModule { }
