import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { Ability, PureAbility } from "@casl/ability";
import { NotFoundComponent } from "@core/components/not-found/not-found.component";
import { CacheInterceptor } from "@core/interceptors/cache-interceptor.service";
import { HttpErrorInterceptor } from "@core/interceptors/http-error-interceptor.service";
import { ConfigurationService } from "@core/services/configuration.service";
import { AppAbility } from "@core/utils/ability";
import { FakeMeasurementBackend } from "@features/widget/services/generate_local_measurements";
import {
  AggregateFactory,
  ArchiveFactory,
  MeasurementFactory,
} from "@features/widget/services/measurementFactories";
import { ApiModule, ApiService, BASE_PATH } from "@pnsn/ngx-squacapi-client";
import { SharedModule } from "@shared/shared.module";
import { AggregateAdapter } from "@squacapi/models/aggregate";
import { ArchiveAdapter } from "@squacapi/models/archive";
import { MeasurementAdapter } from "@squacapi/models/measurement";
import { AggregateService } from "@squacapi/services/aggregate.service";
import { DayArchiveService } from "@squacapi/services/archive.service";
import { MeasurementService } from "@squacapi/services/measurement.service";
import { environment } from "environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthComponent } from "./core/components/auth/auth.component";
import { HomeComponent } from "./core/components/home/home.component";
import { AuthInterceptor } from "./core/interceptors/auth-interceptor.service";
import { MenuComponent } from "@core/components/menu/menu.component";
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from "@angular/material/core";

export function initApp(configurationService: ConfigurationService) {
  return () => configurationService.load().toPromise();
}

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    NotFoundComponent,
    HomeComponent,
    MenuComponent,
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

    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
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
      useClass: CacheInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    { provide: AppAbility, useValue: new AppAbility() },
    { provide: PureAbility, useExisting: Ability },
    {
      provide: MeasurementService,
      useFactory: MeasurementFactory,
      deps: [BASE_PATH, MeasurementAdapter, ApiService, FakeMeasurementBackend],
    },
    {
      provide: DayArchiveService,
      useFactory: ArchiveFactory,
      deps: [BASE_PATH, ArchiveAdapter, ApiService, FakeMeasurementBackend],
    },
    {
      provide: AggregateService,
      useFactory: AggregateFactory,
      deps: [BASE_PATH, AggregateAdapter, ApiService, FakeMeasurementBackend],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
