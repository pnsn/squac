import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { SquacApiService } from "@core/services/squacapi.service";
import { MockSquacApiService } from "@core/services/squacapi.service.mock";
import { NetworkService } from "./network.service";

describe("NetworkService", () => {
  let networkService: NetworkService;
  const testNetwork = {
    class_name: "string",
    code: "code",
    name: "name",
    url: "url",
    description: "desc",
    created_at: "date",
    updated_at: "date",
    user: 1,
  };
  const mockSquacApiService = new MockSquacApiService(testNetwork);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: SquacApiService, useValue: mockSquacApiService }],
    });

    networkService = TestBed.inject(NetworkService);
  });

  it("should be created", () => {
    const service: NetworkService = TestBed.inject(NetworkService);

    expect(service).toBeTruthy();
  });

  it("should fetch networks", () => {
    networkService.fetchNetworks();
    expect(networkService.networks[0].name).toEqual(testNetwork.name);
  });
});
