import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { ArchiveService } from "./archive.service";

describe("ArchiveService", () => {
  let service: ArchiveService;

  beforeEach(() => {
    return MockBuilder(ArchiveService).mock(ApiService);
  });
  beforeEach(() => {
    service = TestBed.inject(ArchiveService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
