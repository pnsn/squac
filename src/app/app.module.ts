import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GroupsComponent } from './groups/groups.component';
import { MetricGroupsComponent } from './metric-groups/metric-groups.component';
import { MetricGroupsEditComponent } from './metric-groups/metric-groups-edit/metric-groups-edit.component';
import { MetricGroupsDetailComponent } from './metric-groups/metric-groups-detail/metric-groups-detail.component';
import { DashboardEditComponent } from './dashboard/dashboard-edit/dashboard-edit.component';
import { GroupDetailComponent } from './groups/group-detail/group-detail.component';
import { GroupEditComponent } from './groups/group-edit/group-edit.component';
import { ChannelGroupsComponent } from './channel-groups/channel-groups.component';
import { ChannelGroupsEditComponent } from './channel-groups/channel-groups-edit/channel-groups-edit.component';
import { ChannelGroupsDetailComponent } from './channel-groups/channel-groups-detail/channel-groups-detail.component';
import { ViewDetailComponent } from './dashboard/view-detail/view-detail.component';
import { ViewEditComponent } from './dashboard/view-edit/view-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    GroupsComponent,
    MetricGroupsComponent,
    MetricGroupsEditComponent,
    MetricGroupsDetailComponent,
    DashboardEditComponent,
    GroupDetailComponent,
    GroupEditComponent,
    ChannelGroupsComponent,
    ChannelGroupsEditComponent,
    ChannelGroupsDetailComponent,
    ViewDetailComponent,
    ViewEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
