import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@features/user/services/user.service';
import { MockUserService } from '@features/user/services/user.service.mock';
import { of } from 'rxjs';

import { AlarmEditComponent } from './alarm-edit.component';

describe('AlarmEditComponent', () => {
  let component: AlarmEditComponent;
  let fixture: ComponentFixture<AlarmEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlarmEditComponent ],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: UserService, useValue: new MockUserService() 
        },
        { provide: ActivatedRoute, useValue: {
          params: of(
            { id: 1}
          ),
          snapshot: {
            data: {
              alarm: {}
            }
          }
        }}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
