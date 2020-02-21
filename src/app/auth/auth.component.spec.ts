import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from './user';
import { MaterialModule } from '../shared/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';


class MockAuthService {
  user = new BehaviorSubject<User>(null);

  logIn() {
    this.user.next(new User(
      'email',
      'token',
      new Date()
    ));
  }

  logOut() {
    this.user.next(null);
  }

}

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let mockAuthService = new MockAuthService();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthComponent ],
      imports: [ FormsModule , MaterialModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
