import { TestBed } from "@angular/core/testing";
import { MockBuilder } from "ng-mocks";
import { InviteService } from "./invite.service";
import { InviteService as InviteApiService } from "@pnsn/ngx-squacapi-client";
import { of } from "rxjs";

describe("InviteService", () => {
  beforeEach(() => {
    return MockBuilder(InviteService, InviteApiService);
  });

  it("should be created", () => {
    const service = TestBed.inject(InviteService);
    expect(service).toBeDefined();
  });

  it("should send invite", () => {
    const apiService = TestBed.inject(InviteApiService);
    const service = TestBed.inject(InviteService);

    const postSpy = spyOn(apiService, "inviteCreate").and.returnValue(of());
    service.sendInviteToUser(1).subscribe();
    expect(postSpy).toHaveBeenCalled();
  });

  it("should send register info", () => {
    const apiService = TestBed.inject(InviteApiService);
    const service = TestBed.inject(InviteService);

    const postSpy = spyOn(apiService, "registerCreate").and.returnValue(of());
    service
      .registerUser("firstname", "lastname", "token", "password")
      .subscribe();
    expect(postSpy).toHaveBeenCalled();
  });
});
