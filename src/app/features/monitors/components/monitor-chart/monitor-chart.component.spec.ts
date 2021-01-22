import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorChartComponent } from './monitor-chart.component';

describe('MonitorChartComponent', () => {
  let component: MonitorChartComponent;
  let fixture: ComponentFixture<MonitorChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
