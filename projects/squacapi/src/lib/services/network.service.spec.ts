import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { NetworkService } from "./network.service";

describe("NetworkService", () => {
  beforeEach(() => {
    return MockBuilder(NetworkService, ApiService);
  });

  it("should be created", () => {
    const networkService = TestBed.inject(NetworkService);
    expect(networkService).toBeDefined();
  });
});
