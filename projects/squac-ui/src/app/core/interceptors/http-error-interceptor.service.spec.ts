import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { MockBuilder, MockRender, NG_MOCKS_INTERCEPTORS } from "ng-mocks";
import { throwError } from "rxjs";
import { AppModule } from "../../app.module";
import { HttpErrorInterceptor } from "./http-error-interceptor.service";

fdescribe("HttpErrorInterceptor", () => {
  beforeEach(() => {
    return MockBuilder(HttpErrorInterceptor, AppModule)
      .replace(HttpClientModule, HttpClientTestingModule)
      .exclude(NG_MOCKS_INTERCEPTORS)
      .keep(HTTP_INTERCEPTORS);
  });

  it("should be created", () => {
    const interceptor = TestBed.inject(HttpErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it("should throw error if error response returned from api", () => {
    const testError = {
      error: "test-message",
      status: 404,
      statusText: "",
      message: "test-message",
    };

    MockRender();

    const client: HttpClient = TestBed.inject(HttpClient);
    const httpMock: HttpTestingController = TestBed.inject(
      HttpTestingController
    );

    client.get("https://test.test.test/").subscribe({
      next: () => fail("should have failed with 404"),
      error: (error: HttpErrorResponse) => {
        expect(error.message).toBe(testError.error);
      },
    });

    const httpRequest = httpMock.expectOne("https://test.test.test/");
    httpRequest.flush(testError.error, testError);
    httpMock.verify();
  });

  it("should throw error if weird error response returned from api", () => {
    const testError = {
      error: "test-message",
      status: 404,
      statusText: "",
      message: "test-message",
    };

    MockRender();

    const client: HttpClient = TestBed.inject(HttpClient);
    const httpMock: HttpTestingController = TestBed.inject(
      HttpTestingController
    );

    client.get("https://test.test.test/").subscribe({
      next: () => fail("should have failed with 404"),
      error: (error: HttpErrorResponse) => {
        expect(error.message).toBe(testError.error);
      },
    });

    const httpRequest = httpMock.expectOne("https://test.test.test/");
    httpRequest.flush(new Error(testError.error), testError);
    httpMock.verify();
  });

  it("should throw error if nested errors", () => {
    const error1 = "error 1";
    const error2 = "error 2";
    const testMessage = error1 + error2;

    MockRender();

    const client: HttpClient = TestBed.inject(HttpClient);
    const httpMock: HttpTestingController = TestBed.inject(
      HttpTestingController
    );

    client.get("https://test.test.test/").subscribe({
      next: () => fail("should have failed with 404"),
      error: (error: HttpErrorResponse) => {
        expect(error.message).toBe(testMessage);
      },
    });

    const httpRequest = httpMock.expectOne("https://test.test.test/");
    httpRequest.flush(
      {
        error1,
        error2,
      },
      { status: 404, statusText: "error" }
    );
    httpMock.verify();
  });
});
