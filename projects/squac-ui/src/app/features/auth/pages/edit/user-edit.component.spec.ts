import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { UserEditComponent } from "./user-edit.component";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ErrorComponent } from "@shared/components/error/error.component";
import { MockBuilder } from "ng-mocks";
import { ActivatedRoute } from "@angular/router";

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
