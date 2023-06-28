import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";
import { PasswordResetService } from "./password-reset.service";

describe("PasswordResetService", () => {
  let service: PasswordResetService = undefined;
  let apiService: ApiService;

  beforeEach(() => {
    return MockBuilder(PasswordResetService, ApiService);
  });
  beforeEach(() => {
    service = TestBed.inject(PasswordResetService);
    apiService = TestBed.inject(ApiService);
  });

  it("should be created", () => {
    expect(service).toBeDefined();
  });

  it("should tell squac to reset password", () => {
    const postSpy = spyOn(apiService, "passwordResetCreate").and.returnValue(
      of()
    );
    service.resetPassword("email").subscribe();
    expect(postSpy).toHaveBeenCalled();
  });

  it("should  send squac the token", () => {
    const postSpy = spyOn(
      apiService,
      "passwordResetValidateTokenCreate"
    ).and.returnValue(of());
    service.validateToken("token").subscribe();
    expect(postSpy).toHaveBeenCalled();
  });

  it("should send squac the password ", () => {
    const postSpy = spyOn(
      apiService,
      "passwordResetConfirmCreate"
    ).and.returnValue(of());
    service.confirmPassword("password").subscribe();
    expect(postSpy).toHaveBeenCalled();
  });
});
