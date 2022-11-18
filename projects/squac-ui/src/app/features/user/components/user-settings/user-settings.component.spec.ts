import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../projects/squac-ui/src/app/features/user/services/user.service";

import { UserSettingsComponent } from "./user-settings.component";
import { MockBuilder } from "ng-mocks";
import { MessageService } from "../projects/squac-ui/src/app/core/services/message.service";
import { UserModule } from "../projects/squac-ui/src/app/features/user/user.module";

describe("UserSettingsComponent", () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;

  beforeEach(() => {
    return MockBuilder(UserSettingsComponent, UserModule)
      .mock(UserService)
      .mock(MessageService)
      .provide({
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            data: {
              user: {},
            },
          },
        },
      });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
