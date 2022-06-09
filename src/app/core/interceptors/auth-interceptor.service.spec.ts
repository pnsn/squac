import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AuthInterceptor } from "./auth-interceptor.service";
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from "@angular/common/http";
import { AuthService } from "../services/auth.service";
import {
  MockBuilder,
  MockInstance,
  MockRender,
  NG_MOCKS_INTERCEPTORS,
} from "ng-mocks";
import { AppModule } from "app/app.module";

describe(`AuthInterceptor`, () => {
  beforeEach(() => {
    return MockBuilder(AuthInterceptor, AppModule)
      .replace(HttpClientModule, HttpClientTestingModule)
      .exclude(NG_MOCKS_INTERCEPTORS)
      .keep(HTTP_INTERCEPTORS)
      .mock(AuthService);
  });

  it("should add an Authorization header if user logged in", () => {
    MockInstance(AuthService, "loggedIn", true);
    MockInstance(AuthService, "auth", "auth");

    const fixture = MockRender("");
    const client: HttpClient = fixture.debugElement.injector.get(HttpClient);
    const httpMock: HttpTestingController = fixture.debugElement.injector.get(
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
    MockInstance(AuthService, "loggedIn", false);
    // Make an HTTP GET request
    const fixture = MockRender("");
    const client: HttpClient = fixture.debugElement.injector.get(HttpClient);
    const httpMock: HttpTestingController = fixture.debugElement.injector.get(
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
