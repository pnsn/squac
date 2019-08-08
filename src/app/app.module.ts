import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { MetricGroupsComponent } from './metric-groups/metric-groups.component';
import { MetricGroupsEditComponent } from './metric-groups/metric-groups-edit/metric-groups-edit.component';
import { MetricGroupsDetailComponent } from './metric-groups/metric-groups-detail/metric-groups-detail.component';
import { DashboardEditComponent } from './dashboards/dashboard-edit/dashboard-edit.component';
import { ChannelGroupsComponent } from './channel-groups/channel-groups.component';
import { ChannelGroupsEditComponent } from './channel-groups/channel-groups-edit/channel-groups-edit.component';
import { ChannelGroupsDetailComponent } from './channel-groups/channel-groups-detail/channel-groups-detail.component';
import { DashboardDetailComponent } from './dashboards/dashboard-detail/dashboard-detail.component';
import { WidgetComponent } from './dashboards/dashboard-detail/widget/widget.component';
import { WidgetEditComponent } from './dashboards/dashboard-detail/widget/widget-edit/widget-edit.component';
import { AuthInterceptor } from './auth-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthComponent } from './auth/auth.component';
import { HeaderComponent } from './header/header.component';
import { ClassComponent } from './class/class.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardsComponent,
    MetricGroupsComponent,
    MetricGroupsEditComponent,
    MetricGroupsDetailComponent,
    DashboardEditComponent,
    ChannelGroupsComponent,
    ChannelGroupsEditComponent,
    ChannelGroupsDetailComponent,
    DashboardDetailComponent,
    WidgetComponent,
    WidgetEditComponent,
    AuthComponent,
    HeaderComponent,
    ClassComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
