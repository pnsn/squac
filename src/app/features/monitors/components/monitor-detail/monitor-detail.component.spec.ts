import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { MonitorDetailComponent } from './monitor-detail.component';

describe('MonitorDetailComponent', () => {
  let component: MonitorDetailComponent;
  let fixture: ComponentFixture<MonitorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorDetailComponent],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {provide: ActivatedRoute, useValue: {
          parent: {
            snapshot: {

              data : {
                monitor: {}
              }
            }
          },
          snapshot: {

            data : {
              monitor: {}
            }
          }
        }}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
