import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { MaterialModule } from '../shared/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MockAuthService } from './auth.service.mock';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let authService : AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthComponent ],
      imports: [ ReactiveFormsModule , MaterialModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboards', component: AuthComponent},
        ]
      )],
      providers: [
        { provide: AuthService, useValue: new MockAuthService() }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthService);
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit user info if the form is valid', ()=>{
    // const authSpy = spyOn(authService, "login");
    expect(component.authForm).toBeDefined();

    component.authForm.patchValue({
      email: "mail@mail.com",
      password: "password"
    });

    expect(component.authForm.valid).toBeTruthy();

    component.onSubmit();

    expect(component.isLoading).toBe(false);
  });

  it('should not submit if the form is not valid', ()=>{
    const authSpy = spyOn(authService, "login");
    expect(component.authForm).toBeDefined();
    expect(component.authForm.valid).toBeFalsy();

    component.onSubmit();

    expect(authSpy).not.toHaveBeenCalled();

  });


});
