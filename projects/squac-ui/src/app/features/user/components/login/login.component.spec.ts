import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthService } from "@core/services/auth.service";
import { MaterialModule } from "@shared/material.module";
import { UserModule } from "@user/user.module";
import { MockBuilder, MockInstance, MockRender } from "ng-mocks";
import { of } from "rxjs";
import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
  beforeEach(() => {
    return MockBuilder(
      [LoginComponent, UserModule, RouterTestingModule.withRoutes([])],
      [MaterialModule, ReactiveFormsModule]
    ).provide({
      provide: AuthService,
      useValue: {
        login: () => of("Login Successful"),
      },
    });
  });

  it("should create", () => {
    const fixture = MockRender(LoginComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should submit user info if the form is valid", () => {
    const fixture = MockRender(LoginComponent);
    const component = fixture.componentInstance;

    expect(component.loginForm).toBeDefined();

    component.loginForm.patchValue({
      email: "mail@mail.com",
      password: "password",
    });

    expect(component.loginForm.valid).toBeTruthy();

    component.onSubmit();

    expect(component.message).toBe("Login successful.");
  });

  it("should not submit if the form is not valid", () => {
    const authSpy = jasmine.createSpy();
    MockInstance(AuthService, () => ({
      login: authSpy,
    }));
    const fixture = MockRender(LoginComponent);
    const component = fixture.componentInstance;

    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.valid).toBeFalsy();

    component.onSubmit();

    expect(authSpy).not.toHaveBeenCalled();
  });
});
