import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PasswordResetComponent } from "./password-reset.component";
import { RouterTestingModule } from "@angular/router/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MockBuilder } from "ng-mocks";
import { PasswordResetService } from "squacapi";

describe("PasswordResetComponent", () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;

  beforeEach(() => {
    return MockBuilder(PasswordResetComponent)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(ReactiveFormsModule)
      .mock(PasswordResetService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
