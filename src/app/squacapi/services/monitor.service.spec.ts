import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MonitorService } from "./monitor.service";

describe("MonitorService", () => {
  let service: MonitorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ApiService, useValue: {} }],
    });
    service = TestBed.inject(MonitorService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
