import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import {
  DayArchiveService,
  HourArchiveService,
  MonthArchiveService,
  WeekArchiveService,
} from "./archive.service";

describe("ArchiveServices", () => {
  beforeEach(() => {
    return MockBuilder(
      [
        DayArchiveService,
        WeekArchiveService,
        HourArchiveService,
        MonthArchiveService,
      ],
      ApiService
    );
  });

  it("achive services should create", () => {
    expect(TestBed.inject(DayArchiveService)).toBeDefined();
    expect(TestBed.inject(HourArchiveService)).toBeDefined();
    expect(TestBed.inject(WeekArchiveService)).toBeDefined();
    expect(TestBed.inject(MonthArchiveService)).toBeDefined();
  });
});
