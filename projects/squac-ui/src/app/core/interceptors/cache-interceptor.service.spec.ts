import {
  HttpClient,
  HttpClientModule,
  HttpResponse,
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
} from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { HttpCacheService } from "@core/services/cache.service";
import {
  MockBuilder,
  MockInstance,
  MockRender,
  NG_MOCKS_INTERCEPTORS,
} from "ng-mocks";
import { CacheInterceptorFn } from "./cache-interceptor.service";

describe("CacheInterceptor", () => {
  beforeEach(() => {
    return MockBuilder()
      .provide(provideHttpClient(withInterceptors([CacheInterceptorFn])))
      .provide(provideHttpClientTesting())
      .replace(HttpClientModule, HttpClientTestingModule)
      .exclude(NG_MOCKS_INTERCEPTORS)
      .keep(HTTP_INTERCEPTORS)
      .mock(HttpCacheService);
  });

  it("should handle request if no cached response", () => {
    MockInstance(HttpCacheService, "get", jasmine.createSpy()).and.returnValue(
      false
    );

    MockRender();

    const client: HttpClient = TestBed.inject(HttpClient);
    const httpMock: HttpTestingController = TestBed.inject(
      HttpTestingController
    );

    const service = TestBed.inject(HttpCacheService);

    client.get("https://test.test.test/").subscribe((response) => {
      expect(response).toEqual("");
      expect(service.get).toHaveBeenCalled();
    });

    const httpRequest = httpMock.expectOne("https://test.test.test/");
    httpRequest.flush("");
    httpMock.verify();
  });

  it("should return cached response for GET", () => {
    const testResponse = new HttpResponse({
      body: "Test Body",
    });
    MockInstance(HttpCacheService, "get", jasmine.createSpy()).and.returnValue(
      testResponse
    );

    MockRender();

    const client: HttpClient = TestBed.inject(HttpClient);
    const httpMock: HttpTestingController = TestBed.inject(
      HttpTestingController
    );

    const service = TestBed.inject(HttpCacheService);

    client.get("https://test.test.test/").subscribe((response) => {
      expect(response).toEqual(testResponse.body);
      expect(service.get).toHaveBeenCalled();
    });

    httpMock.expectNone("https://test.test.test/");
  });

  it("should clear cache when updated", () => {
    MockInstance(
      HttpCacheService,
      "delete",
      jasmine.createSpy()
    ).and.returnValue(true);

    MockRender();

    const client: HttpClient = TestBed.inject(HttpClient);
    const httpMock: HttpTestingController = TestBed.inject(
      HttpTestingController
    );

    const service = TestBed.inject(HttpCacheService);

    client.delete("https://test.test.test/").subscribe((response) => {
      expect(response).toEqual("");
      expect(service.delete).toHaveBeenCalled();
    });

    const httpRequest = httpMock.expectOne("https://test.test.test/");
    httpRequest.flush("");
    httpMock.verify();
  });
});
