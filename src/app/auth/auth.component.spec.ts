import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import { FormsModule, Form } from '@angular/forms';
import { AuthService } from './auth.service';
import { MaterialModule } from '../shared/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MockAuthService } from './auth.service.mock';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let testForm = 
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthComponent ],
      imports: [ FormsModule , MaterialModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: new MockAuthService() }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if the form is not valid', ()=>{
    const form = fixture.nativeElement.querySelector('logInForm');
    console.log("form", form);

  });


});
