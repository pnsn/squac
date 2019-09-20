import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChannelGroupsComponent } from './channel-groups/channel-groups.component';
import { ChannelGroupsEditComponent } from './channel-groups/channel-groups-edit/channel-groups-edit.component';
import { ChannelGroupsDetailComponent } from './channel-groups/channel-groups-detail/channel-groups-detail.component';
import { AuthComponent } from './auth/auth.component';
import { HeaderComponent } from './header/header.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { ChannelGroupsViewComponent } from './channel-groups/channel-groups-view/channel-groups-view.component';
import { MetricsComponent } from './metrics/metrics.component';
import { MetricsDetailComponent } from './metrics/metrics-detail/metrics-detail.component';
import { MetricsViewComponent } from './metrics/metrics-view/metrics-view.component';
import { MetricsEditComponent } from './metrics/metrics-edit/metrics-edit.component';
import { HttpErrorInterceptor } from './http-error-interceptor.service';
import { DashboardsModule } from './dashboards/dashboards.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    ChannelGroupsComponent,
    ChannelGroupsEditComponent,
    ChannelGroupsDetailComponent,
    ChannelGroupsViewComponent,
    MetricsComponent,
    MetricsDetailComponent,
    MetricsViewComponent,
    MetricsEditComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    DashboardsModule,
    SharedModule
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
