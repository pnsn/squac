import { TestBed } from "@angular/core/testing";
import { ApiService } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";

import { UserMeService } from "./user-me.service";

describe("UserMeService", () => {
  let service: UserMeService;

  beforeEach(() => {
    return MockBuilder(UserMeService).mock(ApiService);
  });
  beforeEach(() => {
    service = TestBed.inject(UserMeService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
