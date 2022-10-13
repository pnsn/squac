import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { Ability, PureAbility } from "@casl/ability";
import { NotFoundComponent } from "@core/components/not-found/not-found.component";
import { HttpErrorInterceptor } from "@core/interceptors/http-error-interceptor.service";
import { ConfigurationService } from "@core/services/configuration.service";
import { AppAbility } from "@core/utils/ability";
import { ApiModule, BASE_PATH } from "@pnsn/ngx-squacapi-client";
import { SharedModule } from "@shared/shared.module";
import { environment } from "environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthComponent } from "./core/components/auth/auth.component";
import { HeaderComponent } from "./core/components/header/header.component";
import { HomeComponent } from "./core/components/home/home.component";
import { AuthInterceptor } from "./core/interceptors/auth-interceptor.service";

export function initApp(configurationService: ConfigurationService) {
  return () => configurationService.load().toPromise();
}

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    NotFoundComponent,
    HomeComponent,
  ],
  imports: [
    ApiModule,
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule,
    BrowserModule,
    LeafletModule,
    LeafletDrawModule,
    // Always load this at the end or the routing gets weird
    AppRoutingModule,
  ],
  providers: [
    {
      provide: BASE_PATH,
      useValue: environment.API_BASE_PATH,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      multi: true,
      deps: [ConfigurationService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    { provide: AppAbility, useValue: new AppAbility() },
    { provide: PureAbility, useExisting: Ability },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
