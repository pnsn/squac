import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmChartComponent } from './alarm-chart.component';

describe('AlarmChartComponent', () => {
  let component: AlarmChartComponent;
  let fixture: ComponentFixture<AlarmChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlarmChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
