import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChannelGroupsComponent } from './features/channel-groups/channel-groups.component';
import { ChannelGroupsEditComponent } from './features/channel-groups/channel-groups-edit/channel-groups-edit.component';
import { AuthComponent } from './core/components/auth/auth.component';
import { HeaderComponent } from './core/components/header/header.component';
import { AuthInterceptorService } from './core/interceptors/auth-interceptor.service';
import { ChannelGroupsViewComponent } from './features/channel-groups/channel-groups-view/channel-groups-view.component';
import { MetricsComponent } from './features/metrics/metrics.component';
import { MetricsDetailComponent } from './features/metrics/metrics-detail/metrics-detail.component';
import { MetricsViewComponent } from './features/metrics/metrics-view/metrics-view.component';
import { MetricsEditComponent } from './features/metrics/metrics-edit/metrics-edit.component';
import { HttpErrorInterceptor } from './core/interceptors/http-error-interceptor.service';
import { DashboardsModule } from './features/dashboards/dashboards.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChannelGroupsFilterComponent } from './features/channel-groups/channel-groups-edit/channel-groups-filter/channel-groups-filter.component';
import { ChannelGroupsTableComponent } from './features/channel-groups/channel-groups-edit/channel-groups-table/channel-groups-table.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { UserComponent } from './core/components/user/user.component';
import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';
import { PasswordResetComponent } from './core/components/password-reset/password-reset.component';
import { LoginComponent } from './core/components/login/login.component';
import { AppAbility } from './core/utils/ability';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    ChannelGroupsComponent,
    ChannelGroupsEditComponent,
    ChannelGroupsViewComponent,
    MetricsComponent,
    MetricsDetailComponent,
    MetricsViewComponent,
    MetricsEditComponent,
    ChannelGroupsFilterComponent,
    ChannelGroupsTableComponent,
    UserComponent,
    PasswordResetComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    DashboardsModule,
    SharedModule,
    BrowserAnimationsModule,
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    AbilityModule
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
    },
    { provide: AppAbility, useValue: new AppAbility() },
    { provide: PureAbility , useExisting: Ability }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
