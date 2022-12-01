import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { HttpErrorInterceptor } from "./http-error-interceptor.service";

describe("HttpErrorInterceptor", () => {
  let interceptor;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpErrorInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true,
        },
      ],
    });
    interceptor = TestBed.inject(HttpErrorInterceptor);
  });

  it("should be created", () => {
    expect(interceptor).toBeTruthy();
  });

  // it("should throw error if error response returned from api", () => {
  //   const testError = {
  //     error: "test-message",
  //     status: 404,
  //   };
  //   // arrange
  //   httpRequestSpy = jasmine.createSpyObj("HttpRequest", ["doesNotMatter"]);
  //   httpHandlerSpy = jasmine.createSpyObj("HttpHandler", ["handle"]);
  //   httpHandlerSpy.handle.and.returnValue(throwError(testError));
  //   // act
  //   interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
  //     () => {
  //       return;
  //     },
  //     (err) => {
  //       expect(err).toEqual(`Error: ${testError.error}`);
  //     }
  //   );
  // });

  // it("should throw error if weird error response returned from api", () => {
  //   const testError = {
  //     error: { message: "error message" },
  //     status: 404,
  //   };
  //   // arrange
  //   httpRequestSpy = jasmine.createSpyObj("HttpRequest", ["doesNotMatter"]);
  //   httpHandlerSpy = jasmine.createSpyObj("HttpHandler", ["handle"]);
  //   httpHandlerSpy.handle.and.returnValue(throwError(testError));
  //   // act
  //   interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
  //     () => {
  //       return;
  //     },
  //     (err) => {
  //       expect(err).toEqual("Error: " + "message " + testError.error.message);
  //     }
  //   );
  // });

  // it("should throw error if client side error", () => {
  //   const testError = new ErrorEvent("error", {
  //     error: new Error("test error"),
  //     message: "test message",
  //     lineno: 402,
  //     filename: "closet.html",
  //   });
  //   // arrange
  //   httpRequestSpy = jasmine.createSpyObj("HttpRequest", ["doesNotMatter"]);
  //   httpHandlerSpy = jasmine.createSpyObj("HttpHandler", ["handle"]);
  //   httpHandlerSpy.handle.and.returnValue(throwError(testError));
  //   // act
  //   interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
  //     () => {
  //       return;
  //     },
  //     (err) => {
  //       expect(err).toEqual(`Error: ${testError.error.message}`);
  //     }
  //   );
  // });
});
