import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MaterialModule } from '@shared/material.module';

import { UserNotificationComponent } from './user-notification.component';

describe('UserNotificationComponent', () => {
  let component: UserNotificationComponent;
  let fixture: ComponentFixture<UserNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserNotificationComponent ],
      imports: [ 
        HttpClientTestingModule,
        ReactiveFormsModule,
        MaterialModule
       ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
