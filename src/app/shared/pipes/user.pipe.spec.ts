import { TestBed } from "@angular/core/testing";
import { UserService } from "@user/services/user.service";
import { MockUserService } from "@user/services/user.service.mock";
import { UserPipe } from "./user.pipe";

describe("UserPipe", () => {
  let userService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: UserService, useValue: new MockUserService() }],
    });

    userService = TestBed.inject(UserService);
  });

  it("create an instance", () => {
    const pipe = new UserPipe(userService);
    expect(pipe).toBeTruthy();
  });
});
