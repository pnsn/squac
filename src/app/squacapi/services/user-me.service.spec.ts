import { TestBed } from "@angular/core/testing";

import { UserMeService } from "./user-me.service";

describe("UserMeService", () => {
  let service: UserMeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMeService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
