import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserEditComponent } from "./user-edit.component";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBuilder } from "ng-mocks";

describe("UserEditComponent", () => {
  let component: UserEditComponent;
  let fixture: ComponentFixture<UserEditComponent>;

  beforeEach(() => {
    return MockBuilder(UserEditComponent).keep(
      RouterTestingModule.withRoutes([
        { path: "login", component: UserEditComponent },
      ])
    );
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
