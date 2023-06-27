import { TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "@core/services/message.service";

import {
  MockBuilder,
  MockInstance,
  MockRender,
  MockService,
  ngMocks,
} from "ng-mocks";
import { User } from "squacapi";
import { HomeComponent } from "./home.component";

fdescribe("HomeComponent", () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(() => {
    return MockBuilder(HomeComponent).mock(ActivatedRoute);
  });

  it("should create", () => {
    const fixture = MockRender(HomeComponent);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });

  it("should show an error if no user", () => {
    MockInstance(
      ActivatedRoute,
      "snapshot",
      jasmine.createSpy(),
      "get"
    ).and.returnValue({
      data: {},
    });
    const fixture = MockRender(HomeComponent);
    const messageService = TestBed.inject(MessageService);

    fixture.detectChanges();
    expect(messageService.error).toHaveBeenCalled();
  });

  it("should set the user if exists", () => {
    const testUser = MockService(User);
    MockInstance(
      ActivatedRoute,
      "snapshot",
      jasmine.createSpy(),
      "get"
    ).and.returnValue({
      data: {
        user: testUser,
      },
    });

    const fixture = MockRender(HomeComponent);
    fixture.detectChanges();
    expect(fixture.point.componentInstance.user).toEqual(testUser);
  });
});
