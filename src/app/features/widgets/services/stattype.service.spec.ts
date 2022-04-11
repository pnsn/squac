import { TestBed } from "@angular/core/testing";

import { StatTypeService } from "./stattype.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SquacApiService } from "@core/services/squacapi.service";
import { MockSquacApiService } from "@core/services/squacapi.service.mock";

describe("StatTypeService", () => {
  let statTypeService: StatTypeService;
  let squacApiService;
  const testData = {
    id: 1,
    type: "string",
    name: "string",
    description: "string",
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: SquacApiService,
          useValue: new MockSquacApiService(testData),
        },
      ],
    });

    statTypeService = TestBed.inject(StatTypeService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it("should be created", () => {
    expect(statTypeService).toBeTruthy();
  });

  it("should get stattypes", () => {
    const statSpy = spyOn(squacApiService, "get").and.callThrough();
    statTypeService.getStatTypes().subscribe();
    expect(statSpy).toHaveBeenCalled();
  });

  it("should return local stattypes", () => {
    statTypeService.getStatTypes().subscribe();
    const statSpy = spyOn(squacApiService, "get").and.callThrough();
    statTypeService.getStatTypes().subscribe();
    expect(statSpy).not.toHaveBeenCalled();
  });
});
