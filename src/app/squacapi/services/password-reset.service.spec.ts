import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { PasswordResetService } from "./password-reset.service";

describe("PasswordResetService", () => {
  let service: PasswordResetService;

  beforeEach(() => {
    return MockBuilder(PasswordResetService).mock(ApiService);
  });
  beforeEach(() => {
    service = TestBed.inject(PasswordResetService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  // it("should tell squac to reset password", () => {
  //   const postSpy = spyOn(squacApiService, "post").and.callThrough();
  //   service.resetPassword("email").subscribe();
  //   expect(postSpy).toHaveBeenCalled();
  // });

  // it("should  send squac the token", () => {
  //   const postSpy = spyOn(squacApiService, "post").and.callThrough();
  //   service.validateToken("token").subscribe();
  //   expect(postSpy).toHaveBeenCalled();
  // });

  // it("should send squac the password ", () => {
  //   const postSpy = spyOn(squacApiService, "post").and.callThrough();
  //   service.confirmPassword("password").subscribe();
  //   expect(postSpy).toHaveBeenCalled();
  // });
});
