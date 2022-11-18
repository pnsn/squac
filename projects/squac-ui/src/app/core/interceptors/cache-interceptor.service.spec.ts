import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { HttpCacheService } from "../projects/squac-ui/src/app/core/services/cache.service";
import { MockBuilder, NG_MOCKS_INTERCEPTORS } from "ng-mocks";
import { CacheInterceptor } from "./cache-interceptor.service";

describe("CacheInterceptor", () => {
  let interceptor: CacheInterceptor;
  beforeEach(() => {
    return MockBuilder(CacheInterceptor)
      .replace(HttpClientModule, HttpClientTestingModule)
      .exclude(NG_MOCKS_INTERCEPTORS)
      .keep(HTTP_INTERCEPTORS)
      .mock(HttpCacheService);
  });

  it("should be created", () => {
    interceptor = TestBed.inject(CacheInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
