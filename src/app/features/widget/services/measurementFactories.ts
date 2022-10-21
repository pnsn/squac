import { AggregateService } from "@squacapi/services/aggregate.service";
import { DayArchiveService } from "@squacapi/services/archive.service";
import { MeasurementService } from "@squacapi/services/measurement.service";

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

export function ArchiveFactory(path, adapter, service, fakeService) {
  if (path === "http://localhost:8000") {
    return new DayArchiveService(adapter, fakeService);
  } else {
    return new DayArchiveService(adapter, service);
  }
}
