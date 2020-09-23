
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './core/components/auth/auth.component';
import { HeaderComponent } from './core/components/header/header.component';
import { AuthInterceptorService } from './core/interceptors/auth-interceptor.service';

import { SharedModule } from '@shared/shared.module';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';

import { Ability, PureAbility } from '@casl/ability';

import { AppAbility } from '@core/utils/ability';

import { NotFoundComponent } from '@core/components/not-found/not-found.component';
import { LoadingScreenComponent } from '@core/components/loading-screen/loading-screen.component';

import { HttpErrorInterceptor } from '@core/interceptors/http-error-interceptor.service';
import { LoadingInterceptor } from '@core/interceptors/loading.interceptor';
import { HomeComponent } from './core/components/home/home.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    NotFoundComponent,
    LoadingScreenComponent,
    HomeComponent,
  ],
  imports: [
    HttpClientModule,
    SharedModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    BrowserModule,
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),

    // Always load this at the end or the routing gets weird
    AppRoutingModule
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
