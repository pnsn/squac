import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { PasswordResetComponent } from "./password-reset.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { PasswordResetService } from "../../services/password-reset.service";
import { MaterialModule } from "@shared/material.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";
import { MockBuilder } from "ng-mocks";
import { UserModule } from "@features/user/user.module";

describe("PasswordResetComponent", () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;

  beforeEach(() => {
    return MockBuilder(PasswordResetComponent, UserModule)
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
