import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";

import { UserMeService } from "./user-me.service";

describe("UserMeService", () => {
  beforeEach(() => {
    return MockBuilder(UserMeService, ApiService);
  });
  it("should be created", () => {
    const service = TestBed.inject(UserMeService);
    expect(service).toBeDefined();
  });

  // it("should call read for no params", () => {
  //   const service = TestBed.inject(UserMeService);
  //   const apiService = TestBed.inject(ApiService);

  //   const postSpy = spyOn(apiService, "userMeRead").and.returnValue(of());
  //   service.read().subscribe(() => expect(postSpy).toHaveBeenCalled());
  // });

  it("should return partial update params", () => {
    const service = TestBed.inject(UserMeService);
    const params = service._partialUpdateParams(
      { firstname: "firstname", lastname: "lastname", email: "email" },
      ["firstname"]
    );
    expect(params.data).toEqual({
      firstname: "firstname",
      lastname: "lastname",
    });
  });
});
