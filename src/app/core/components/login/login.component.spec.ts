import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MockAuthService } from '../../services/auth.service.mock';
import { MaterialModule } from 'src/app/shared/material.module';



describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ ReactiveFormsModule , MaterialModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboards', component: LoginComponent},
        ]
      )],
      providers: [
        { provide: AuthService, useValue: new MockAuthService() }

      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit user info if the form is valid', () => {
    // const authSpy = spyOn(authService, "login");
    expect(component.loginForm).toBeDefined();

    component.loginForm.patchValue({
      email: 'mail@mail.com',
      password: 'password'
    });

    expect(component.loginForm.valid).toBeTruthy();

    component.onSubmit();

    expect(component.error).toBeFalsy();
  });

  it('should not submit if the form is not valid', () => {
    const authSpy = spyOn(authService, 'login');
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.valid).toBeFalsy();

    component.onSubmit();

    expect(authSpy).not.toHaveBeenCalled();

  });

});
