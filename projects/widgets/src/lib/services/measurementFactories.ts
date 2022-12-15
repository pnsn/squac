import { ApiService } from "@pnsn/ngx-squacapi-client";
import {
  AggregateAdapter,
  AggregateService,
  ArchiveAdapter,
  MeasurementAdapter,
} from "squacapi";
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
 * @param adapter data adapter
 * @param service api service
 * @param fakeService fake api service
 * @returns measurement service
 */
export function MeasurementFactory(
  path: string,
  adapter: MeasurementAdapter,
  service: ApiService,
  fakeService
): MeasurementService {
  if (path === "http://localhost:8000") {
    return new MeasurementService(adapter, fakeService);
  } else {
    return new MeasurementService(adapter, service);
  }
}

/**
 * Returns new aggregate service using the real api unless
 * using localhost
 *
 * @param path url path
 * @param adapter data adapter
 * @param service api service
 * @param fakeService fake api service
 * @returns aggregate service
 */
export function AggregateFactory(
  path: string,
  adapter: AggregateAdapter,
  service: ApiService,
  fakeService
): AggregateService {
  if (path === "http://localhost:8000") {
    return new AggregateService(adapter, fakeService);
  } else {
    return new AggregateService(adapter, service);
  }
}

/**
 * Returns new day archive service using the real api unless
 * using localhost
 *
 * @param path url path
 * @param adapter data adapter
 * @param service api service
 * @param fakeService fake api service
 * @returns day archive service
 */
export function DayArchiveFactory(
  path: string,
  adapter: ArchiveAdapter,
  service: ApiService,
  fakeService
): DayArchiveService {
  if (path === "http://localhost:8000") {
    return new DayArchiveService(adapter, fakeService);
  } else {
    return new DayArchiveService(adapter, service);
  }
}

/**
 * Returns new hour archive service using the real api unless
 * using localhost
 *
 * @param path url path
 * @param adapter data adapter
 * @param service api service
 * @param fakeService fake api service
 * @returns hour archive service
 */
export function HourArchiveFactory(
  path: string,
  adapter: ArchiveAdapter,
  service: ApiService,
  fakeService
): HourArchiveService {
  if (path === "http://localhost:8000") {
    return new HourArchiveService(adapter, fakeService);
  } else {
    return new HourArchiveService(adapter, service);
  }
}

/**
 * Returns new week archive service using the real api unless
 * using localhost
 *
 * @param path url path
 * @param adapter data adapter
 * @param service api service
 * @param fakeService fake api service
 * @returns week archive service
 */
export function WeekArchiveFactory(
  path: string,
  adapter: ArchiveAdapter,
  service: ApiService,
  fakeService
): WeekArchiveService {
  if (path === "http://localhost:8000") {
    return new WeekArchiveService(adapter, fakeService);
  } else {
    return new WeekArchiveService(adapter, service);
  }
}

/**
 * Returns new month archive service using the real api unless
 * using localhost
 *
 * @param path url path
 * @param adapter data adapter
 * @param service api service
 * @param fakeService fake api service
 * @returns month archive service
 */
export function MonthArchiveFactory(
  path: string,
  adapter: ArchiveAdapter,
  service: ApiService,
  fakeService
): MonthArchiveService {
  if (path === "http://localhost:8000") {
    return new MonthArchiveService(adapter, fakeService);
  } else {
    return new MonthArchiveService(adapter, service);
  }
}
