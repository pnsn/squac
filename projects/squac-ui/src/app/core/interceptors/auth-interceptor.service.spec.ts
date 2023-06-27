import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import {
  MockBuilder,
  MockInstance,
  MockRender,
  NG_MOCKS_INTERCEPTORS,
} from "ng-mocks";
import { AppModule } from "../../app.module";
import { AuthService } from "../services/auth.service";
import { AuthInterceptor } from "./auth-interceptor.service";

describe(`AuthInterceptor`, () => {
  beforeEach(() => {
    return MockBuilder(AuthInterceptor, AppModule)
      .replace(HttpClientModule, HttpClientTestingModule)
      .exclude(NG_MOCKS_INTERCEPTORS)
      .keep(HTTP_INTERCEPTORS)
      .mock(AuthService);
  });

  it("should be created", () => {
    const interceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it("should add an Authorization header if user logged in", () => {
    MockInstance(AuthService, "isAuthenticated", () => true);
    MockInstance(AuthService, "auth", "auth");

    MockRender();
    const client: HttpClient = TestBed.inject(HttpClient);
    const httpMock: HttpTestingController = TestBed.inject(
      HttpTestingController
    );

    // Make an HTTP GET request
    client.get("https://test.test.test/").subscribe();

    const httpRequest = httpMock.expectOne("https://test.test.test/");
    httpRequest.flush("");
    httpMock.verify();
    expect(httpRequest.request.headers.has("Authorization")).toEqual(true);
  });

  it("should not add an Authorization header if user not logged in", () => {
    MockInstance(AuthService, "isAuthenticated", () => false);
    // Make an HTTP GET request
    MockRender();
    const client: HttpClient = TestBed.inject(HttpClient);
    const httpMock: HttpTestingController = TestBed.inject(
      HttpTestingController
    );

    // Make an HTTP GET request
    client.get("https://test.test.test/").subscribe();

    const httpRequest = httpMock.expectOne("https://test.test.test/");
    httpRequest.flush("");
    httpMock.verify();

    expect(httpRequest.request.headers.has("Authorization")).toEqual(false);
  });
});
