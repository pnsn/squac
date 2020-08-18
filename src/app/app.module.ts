import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './core/components/auth/auth.component';
import { HeaderComponent } from './core/components/header/header.component';
import { AuthInterceptorService } from './core/interceptors/auth-interceptor.service';

import { DashboardsModule } from '@features/dashboards/dashboards.module';
import { SharedModule } from '@shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';

import { AbilityModule } from '@casl/angular';
import { Ability, PureAbility } from '@casl/ability';

import { AppAbility } from '@core/utils/ability';
import { ChannelGroupsModule } from './features/channel-groups/channel-groups.module';
import { NotFoundComponent } from '@core/components/not-found/not-found.component';
import { LoadingScreenComponent } from '@core/components/loading-screen/loading-screen.component';
import { UserModule } from '@features/user/user.module';
import { MetricsModule } from '@features/metrics/metrics.module';
import { HttpErrorInterceptor } from '@core/interceptors/http-error-interceptor.service';
import { LoadingInterceptor } from '@core/interceptors/loading.interceptor';




@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    NotFoundComponent,
    LoadingScreenComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DashboardsModule,
    SharedModule,
    ChannelGroupsModule,
    UserModule,
    MetricsModule,
    BrowserAnimationsModule,
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot()
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    { provide: AppAbility, useValue: new AppAbility() },
    { provide: PureAbility , useExisting: Ability }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
