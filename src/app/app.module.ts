import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { DashboardEditComponent } from './dashboards/dashboard-edit/dashboard-edit.component';
import { ChannelGroupsComponent } from './channel-groups/channel-groups.component';
import { ChannelGroupsEditComponent } from './channel-groups/channel-groups-edit/channel-groups-edit.component';
import { ChannelGroupsDetailComponent } from './channel-groups/channel-groups-detail/channel-groups-detail.component';
import { DashboardDetailComponent } from './dashboards/dashboard-detail/dashboard-detail.component';
import { WidgetComponent } from './dashboards/dashboard-detail/widget/widget.component';
import { WidgetEditComponent } from './dashboards/dashboard-detail/widget/widget-edit/widget-edit.component';
import { AuthComponent } from './auth/auth.component';
import { HeaderComponent } from './header/header.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { ChannelGroupsViewComponent } from './channel-groups/channel-groups-view/channel-groups-view.component';
import { MetricsComponent } from './metrics/metrics.component';
import { MetricsDetailComponent } from './metrics/metrics-detail/metrics-detail.component';
import { MetricsViewComponent } from './metrics/metrics-view/metrics-view.component';
import { MetricsEditComponent } from './metrics/metrics-edit/metrics-edit.component';
import { DashboardViewComponent } from './dashboards/dashboard-view/dashboard-view.component';
import { HttpErrorInterceptor } from './http-error.interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardsComponent,
    DashboardEditComponent,
    ChannelGroupsComponent,
    ChannelGroupsEditComponent,
    ChannelGroupsDetailComponent,
    DashboardDetailComponent,
    WidgetComponent,
    WidgetEditComponent,
    AuthComponent,
    HeaderComponent,
    ChannelGroupsViewComponent,
    MetricsComponent,
    MetricsDetailComponent,
    MetricsViewComponent,
    MetricsEditComponent,
    DashboardViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
