import { TestBed } from "@angular/core/testing";
import { SquacApiService } from "@core/services/squacapi.service";
import { MockSquacApiService } from "@core/services/squacapi.service.mock";

import { TriggerService } from "./triggers.service";

describe("TriggerService", () => {
  let service: TriggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SquacApiService, useValue: new MockSquacApiService() },
      ],
    });
    service = TestBed.inject(TriggerService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
