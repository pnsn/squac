import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Ability, PureAbility } from '@casl/ability';
import { AbilityModule } from '@casl/angular';
import { AppAbility } from '@core/utils/ability';
import { of } from 'rxjs';
import { MonitorChartComponent } from '../monitor-chart/monitor-chart.component';

import { MonitorDetailComponent } from './monitor-detail.component';

describe('MonitorDetailComponent', () => {
  let component: MonitorDetailComponent;
  let fixture: ComponentFixture<MonitorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorDetailComponent, MonitorChartComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        AbilityModule
      ],
      providers: [
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility , useExisting: Ability },
        {
          provide: ActivatedRoute, useValue: {
          parent: {
            snapshot: {
              data : {
              }
            }
          },
          data : of()
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
