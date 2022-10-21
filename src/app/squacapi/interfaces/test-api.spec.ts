import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { TestBaseApiService } from "@squacapi/interfaces/api-service";
import { Test, TestApiService } from "./test";
//apiService.

export enum TestApiMethod {
  LIST = "List",
  READ = "Read",
}
export enum TestApiEndpoint {
  TEST,
}

type ApiConfig = {
  class: any;
  methods: {
    [key in TestApiMethod]?: any;
  };
  app: string;
  model: string;
};
export const TestApiRoutes: {
  [key in TestApiEndpoint]: ApiConfig;
} = {
  [TestApiEndpoint.TEST]: {
    class: Test,
    methods: {
      [TestApiMethod.LIST]: [],
    },
    app: "Test",
    model: "Test",
  },
};

describe("TestApiService", () => {
  let service: TestBaseApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ApiService,
          useValue: TestApiService,
        },
      ],
    });
    service = TestBed.inject(TestBaseApiService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
