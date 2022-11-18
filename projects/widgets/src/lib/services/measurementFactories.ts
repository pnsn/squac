import { AggregateService } from "squacapi";
import {
  DayArchiveService,
  HourArchiveService,
  MonthArchiveService,
  WeekArchiveService,
} from "squacapi";
import { MeasurementService } from "squacapi";

export function MeasurementFactory(path, adapter, service, fakeService) {
  if (path === "http://localhost:8000") {
    return new MeasurementService(adapter, fakeService);
  } else {
    return new MeasurementService(adapter, service);
  }
}

export function AggregateFactory(path, adapter, service, fakeService) {
  if (path === "http://localhost:8000") {
    return new AggregateService(adapter, fakeService);
  } else {
    return new AggregateService(adapter, service);
  }
}

export function DayArchiveFactory(path, adapter, service, fakeService) {
  if (path === "http://localhost:8000") {
    return new DayArchiveService(adapter, fakeService);
  } else {
    return new DayArchiveService(adapter, service);
  }
}
export function HourArchiveFactory(path, adapter, service, fakeService) {
  if (path === "http://localhost:8000") {
    return new HourArchiveService(adapter, fakeService);
  } else {
    return new HourArchiveService(adapter, service);
  }
}
export function WeekArchiveFactory(path, adapter, service, fakeService) {
  if (path === "http://localhost:8000") {
    return new WeekArchiveService(adapter, fakeService);
  } else {
    return new WeekArchiveService(adapter, service);
  }
}

export function MonthArchiveFactory(path, adapter, service, fakeService) {
  if (path === "http://localhost:8000") {
    return new MonthArchiveService(adapter, fakeService);
  } else {
    return new MonthArchiveService(adapter, service);
  }
}
