import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from "@angular/material/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { Ability, PureAbility } from "@casl/ability";
import { NotFoundComponent } from "@core/components";
import { ApiModule, ApiService, BASE_PATH } from "@pnsn/ngx-squacapi-client";
import { SharedModule } from "@shared/shared.module";
import {
  AggregateAdapter,
  AggregateService,
  ArchiveAdapter,
  DayArchiveService,
  HourArchiveService,
  MeasurementAdapter,
  MeasurementService,
  MonthArchiveService,
  WeekArchiveService,
} from "squacapi";
import {
  AggregateFactory,
  DayArchiveFactory,
  FakeMeasurementBackend,
  HourArchiveFactory,
  MeasurementFactory,
  MonthArchiveFactory,
  WeekArchiveFactory,
} from "widgets";
import { environment } from "../environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthComponent } from "@core/components/auth/auth.component";
import { HomeComponent } from "@core/components/home/home.component";
import { MenuComponent } from "@core/components/menu/menu.component";
import { AuthInterceptor } from "@core/interceptors/auth-interceptor.service";
import { CacheInterceptor } from "@core/interceptors/cache-interceptor.service";
import { HttpErrorInterceptor } from "@core/interceptors/http-error-interceptor.service";
import { ConfigurationService } from "@core/services/configuration.service";
import { AppAbility } from "@core/utils/ability";

export function initApp(configurationService: ConfigurationService) {
  return (): Promise<void> => configurationService.load().toPromise();
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
      useFactory: DayArchiveFactory,
      deps: [BASE_PATH, ArchiveAdapter, ApiService, FakeMeasurementBackend],
    },
    {
      provide: HourArchiveService,
      useFactory: HourArchiveFactory,
      deps: [BASE_PATH, ArchiveAdapter, ApiService, FakeMeasurementBackend],
    },
    {
      provide: WeekArchiveService,
      useFactory: WeekArchiveFactory,
      deps: [BASE_PATH, ArchiveAdapter, ApiService, FakeMeasurementBackend],
    },
    {
      provide: MonthArchiveService,
      useFactory: MonthArchiveFactory,
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