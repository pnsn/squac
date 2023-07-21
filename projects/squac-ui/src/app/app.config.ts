import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { importProvidersFrom } from "@angular/core";
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, withRouterConfig } from "@angular/router";
import { PureAbility } from "@casl/ability";
import {
  MEASUREMENT_PROVIDERS,
  USE_FAKE_MEASUREMENTS,
} from "@core/constants/api-service-config.constant";
import { AuthInterceptorFn } from "@core/interceptors/auth-interceptor.service";
import { CacheInterceptorFn } from "@core/interceptors/cache-interceptor.service";
import { HttpErrorInterceptorFn } from "@core/interceptors/http-error-interceptor.service";
import { AppAbility } from "@core/utils/ability";
import { BASE_PATH } from "@pnsn/ngx-squacapi-client";

import { DEFAULT_WIDGET_TYPES, WIDGET_TYPES } from "widgets";
import { environment } from "../environments/environment";
import { APP_ROUTES } from "./app.routes";

export const APP_CONFIG = {
  providers: [
    // importProvidersFrom(ApplicationModule),
    provideHttpClient(
      withInterceptors([
        AuthInterceptorFn,
        CacheInterceptorFn,
        HttpErrorInterceptorFn,
      ])
    ),
    provideAnimations(),
    provideRouter(
      APP_ROUTES,
      withRouterConfig({
        paramsInheritanceStrategy: "always",
      })
    ),
    importProvidersFrom(MatSnackBarModule, MatDialogModule),
    {
      provide: BASE_PATH,
      useValue: environment.API_BASE_PATH,
    },
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
    {
      provide: WIDGET_TYPES,
      useValue: DEFAULT_WIDGET_TYPES,
    },
    {
      provide: USE_FAKE_MEASUREMENTS,
      useValue: environment.fakeMeasurements,
    },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    { provide: AppAbility, useValue: new AppAbility() },
    { provide: PureAbility, useExisting: AppAbility },
    ...MEASUREMENT_PROVIDERS,
  ],
};
