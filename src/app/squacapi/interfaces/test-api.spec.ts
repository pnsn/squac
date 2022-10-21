import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { TestBaseApiService } from "@squacapi/interfaces/api-service";
import { Test, TestApiService, SquacModel } from "./test";
//apiService.

export enum TestApiMethod {
  LIST = "List",
  READ = "Read",
}
export enum TestApiEndpoint {
  TEST,
}

export const TestApiRoutes: {
  [key in TestApiEndpoint]: typeof SquacModel;
} = {
  [TestApiEndpoint.TEST]: Test,
};

fdescribe("TestApiService", () => {
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

  it("should get list for passed in model", (done: DoneFn) => {
    const testList = {};
    service
      .request(TestApiMethod.LIST, TestApiEndpoint.TEST, testList)
      .subscribe((data) => {
        expect(data).toBeDefined();
        done();
      });
  });
});
