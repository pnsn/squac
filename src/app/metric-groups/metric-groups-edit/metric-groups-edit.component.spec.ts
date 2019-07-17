import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricGroupsEditComponent } from './metric-groups-edit.component';

describe('MetricsEditComponent', () => {
  let component: MetricGroupsEditComponent;
  let fixture: ComponentFixture<MetricGroupsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricGroupsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricGroupsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
