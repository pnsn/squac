import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './core/components/auth/auth.component';
import { HeaderComponent } from './core/components/header/header.component';
import { AuthInterceptorService } from './core/interceptors/auth-interceptor.service';
import { MetricsComponent } from './features/metrics/metrics.component';
import { MetricsDetailComponent } from './features/metrics/metrics-detail/metrics-detail.component';
import { MetricsViewComponent } from './features/metrics/metrics-view/metrics-view.component';
import { MetricsEditComponent } from './features/metrics/metrics-edit/metrics-edit.component';
import { HttpErrorInterceptor } from './core/interceptors/http-error-interceptor.service';
import { DashboardsModule } from './features/dashboards/dashboards.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { UserComponent } from './core/components/user/user.component';
import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';
import { PasswordResetComponent } from './core/components/password-reset/password-reset.component';
import { LoginComponent } from './core/components/login/login.component';
import { AppAbility } from './core/utils/ability';
import { ChannelGroupsModule } from './features/channel-groups/channel-groups.module';
import { NotFoundComponent } from '@core/components/not-found/not-found.component';
import { AdminComponent } from './core/components/admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    MetricsComponent,
    MetricsDetailComponent,
    MetricsViewComponent,
    MetricsEditComponent,
    UserComponent,
    PasswordResetComponent,
    LoginComponent,
    NotFoundComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    DashboardsModule,
    SharedModule,
    ChannelGroupsModule,
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
