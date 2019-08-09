import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricGroupsViewComponent } from './metric-groups-view.component';

describe('MetricGroupsViewComponent', () => {
  let component: MetricGroupsViewComponent;
  let fixture: ComponentFixture<MetricGroupsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricGroupsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricGroupsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
