import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@features/user/services/user.service';
import { MockUserService } from '@features/user/services/user.service.mock';
import { of } from 'rxjs';

import { MonitorEditComponent } from './monitor-edit.component';

describe('MonitorEditComponent', () => {
  let component: MonitorEditComponent;
  let fixture: ComponentFixture<MonitorEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorEditComponent ],
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
              monitor: {}
            }
          }
        }}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
