import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricGroupsComponent } from './metric-groups.component';

describe('MetricsComponent', () => {
  let component: MetricGroupsComponent;
  let fixture: ComponentFixture<MetricGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
