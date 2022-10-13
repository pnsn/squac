import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { InviteService } from "./invite.service";

describe("InviteService", () => {
  let service: InviteService;

  beforeEach(() => {
    return MockBuilder(InviteService).mock(ApiService);
  });
  beforeEach(() => {
    service = TestBed.inject(InviteService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  // it("should send invite", () => {
  //   const postSpy = spyOn(squacApiService, "post").and.callThrough();
  //   service.sendInviteToUser(1).subscribe();
  //   expect(postSpy).toHaveBeenCalled();
  // });

  // it("should send register info", () => {
  //   const postSpy = spyOn(squacApiService, "post").and.callThrough();
  //   service.registerUser("name", "lastname", "token", "password").subscribe();
  //   expect(postSpy).toHaveBeenCalled();
  // });
});
