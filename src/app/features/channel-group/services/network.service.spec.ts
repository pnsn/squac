import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
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
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ApiService, useValue: {} }],
    });

    networkService = TestBed.inject(NetworkService);
  });

  it("should be created", () => {
    const service: NetworkService = TestBed.inject(NetworkService);

    expect(service).toBeTruthy();
  });
});
