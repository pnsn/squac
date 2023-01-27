import { ApiService } from "@pnsn/ngx-squacapi-client";
import { AggregateService } from "squacapi";
import {
  DayArchiveService,
  HourArchiveService,
  MonthArchiveService,
  WeekArchiveService,
} from "squacapi";
import { MeasurementService } from "squacapi";
/**
 * Returns new measurement service using the real api unless
 * using localhost
 *
 * @param path url path
 * @param service api service
 * @param fakeService fake api service
 * @returns measurement service
 */
export function MeasurementFactory(
  path: string,
  service: ApiService,
  fakeService
): MeasurementService {
  if (path === "http://localhost:8000") {
    return new MeasurementService(fakeService);
  } else {
    return new MeasurementService(service);
  }
}

/**
 * Returns new aggregate service using the real api unless
 * using localhost
 *
 * @param path url path
 * @param service api service
 * @param fakeService fake api service
 * @returns aggregate service
 */
export function AggregateFactory(
  path: string,
  service: ApiService,
  fakeService
): AggregateService {
  if (path === "http://localhost:8000") {
    return new AggregateService(fakeService);
  } else {
    return new AggregateService(service);
  }
}

/**
 * Returns new day archive service using the real api unless
 * using localhost
 *
 * @param path url path
 * @param service api service
 * @param fakeService fake api service
 * @returns day archive service
 */
export function DayArchiveFactory(
  path: string,
  service: ApiService,
  fakeService
): DayArchiveService {
  if (path === "http://localhost:8000") {
    return new DayArchiveService(fakeService);
  } else {
    return new DayArchiveService(service);
  }
}

/**
 * Returns new hour archive service using the real api unless
 * using localhost
 *
 * @param path url path
 * @param service api service
 * @param fakeService fake api service
 * @returns hour archive service
 */
export function HourArchiveFactory(
  path: string,
  service: ApiService,
  fakeService
): HourArchiveService {
  if (path === "http://localhost:8000") {
    return new HourArchiveService(fakeService);
  } else {
    return new HourArchiveService(service);
  }
}

/**
 * Returns new week archive service using the real api unless
 * using localhost
 *
 * @param path url path
 * @param service api service
 * @param fakeService fake api service
 * @returns week archive service
 */
export function WeekArchiveFactory(
  path: string,
  service: ApiService,
  fakeService
): WeekArchiveService {
  if (path === "http://localhost:8000") {
    return new WeekArchiveService(fakeService);
  } else {
    return new WeekArchiveService(service);
  }
}

/**
 * Returns new month archive service using the real api unless
 * using localhost
 *
 * @param path url path
 * @param service api service
 * @param fakeService fake api service
 * @returns month archive service
 */
export function MonthArchiveFactory(
  path: string,
  service: ApiService,
  fakeService
): MonthArchiveService {
  if (path === "http://localhost:8000") {
    return new MonthArchiveService(fakeService);
  } else {
    return new MonthArchiveService(service);
  }
}
