import { HttpClient } from "@angular/common/http";
import { inject, InjectionToken } from "@angular/core";
import { ApiService, BASE_PATH } from "@pnsn/ngx-squacapi-client";
import {
  AggregateService,
  DayArchiveService,
  MeasurementService,
  MonthArchiveService,
  WeekArchiveService,
} from "squacapi";
import { FakeMeasurementBackend } from "widgets";

export const USE_FAKE_MEASUREMENTS = new InjectionToken<boolean>(
  "Enables fake backend for measurement services"
);

export const MEASUREMENT_PROVIDERS = [
  {
    provide: MeasurementService,
    useFactory: (httpClient, basePath): MeasurementService => {
      const useFakeMeasurements = inject(USE_FAKE_MEASUREMENTS);
      let service;
      if (useFakeMeasurements) {
        service = new FakeMeasurementBackend();
      } else {
        service = new ApiService(httpClient, basePath, null);
      }
      return new MeasurementService(service);
    },
    deps: [HttpClient, BASE_PATH],
  },
  {
    provide: AggregateService,
    useFactory: (httpClient, basePath): AggregateService => {
      const useFakeMeasurements = inject(USE_FAKE_MEASUREMENTS);
      let service;
      if (useFakeMeasurements) {
        service = new FakeMeasurementBackend();
      } else {
        service = new ApiService(httpClient, basePath, null);
      }
      return new AggregateService(service);
    },
    deps: [HttpClient, BASE_PATH],
  },
  {
    provide: MeasurementService,
    useFactory: (httpClient, basePath): MeasurementService => {
      const useFakeMeasurements = inject(USE_FAKE_MEASUREMENTS);
      let service;
      if (useFakeMeasurements) {
        service = new FakeMeasurementBackend();
      } else {
        service = new ApiService(httpClient, basePath, null);
      }
      return new MeasurementService(service);
    },
    deps: [HttpClient, BASE_PATH],
  },
  {
    provide: DayArchiveService,
    useFactory: (httpClient, basePath): DayArchiveService => {
      const useFakeMeasurements = inject(USE_FAKE_MEASUREMENTS);
      let service;
      if (useFakeMeasurements) {
        service = new FakeMeasurementBackend();
      } else {
        service = new ApiService(httpClient, basePath, null);
      }
      return new DayArchiveService(service);
    },
    deps: [HttpClient, BASE_PATH],
  },
  {
    provide: WeekArchiveService,
    useFactory: (httpClient, basePath): WeekArchiveService => {
      const useFakeMeasurements = inject(USE_FAKE_MEASUREMENTS);
      let service;
      if (useFakeMeasurements) {
        service = new FakeMeasurementBackend();
      } else {
        service = new ApiService(httpClient, basePath, null);
      }
      return new WeekArchiveService(service);
    },
    deps: [HttpClient, BASE_PATH],
  },
  {
    provide: MonthArchiveService,
    useFactory: (httpClient, basePath): MonthArchiveService => {
      const useFakeMeasurements = inject(USE_FAKE_MEASUREMENTS);
      let service;
      if (useFakeMeasurements) {
        service = new FakeMeasurementBackend();
      } else {
        service = new ApiService(httpClient, basePath, null);
      }
      return new MonthArchiveService(service);
    },
    deps: [HttpClient, BASE_PATH],
  },
];
