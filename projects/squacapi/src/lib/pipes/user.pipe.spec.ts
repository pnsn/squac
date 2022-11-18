import { TestBed } from "@angular/core/testing";
import { UserService } from "../projects/squac-ui/src/app/features/user/services/user.service";
import { MockBuilder } from "ng-mocks";
import { UserPipe } from "./user.pipe";

describe("UserPipe", () => {
  let userService;
  beforeEach(() => {
    return MockBuilder(UserPipe).mock(UserService);
  });

  it("create an instance", () => {
    userService = TestBed.inject(UserService);
    const pipe = new UserPipe(userService);
    expect(pipe).toBeTruthy();
  });
});
