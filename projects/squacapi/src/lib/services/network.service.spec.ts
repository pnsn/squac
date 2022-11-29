import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { NetworkService } from "./network.service";

describe("NetworkService", () => {
  let networkService: NetworkService = undefined;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ApiService, useValue: {} }],
    });

    networkService = TestBed.inject(NetworkService);
  });

  it("should be created", () => {
    expect(networkService).toBeTruthy();
  });
});
