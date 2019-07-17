import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricGroupsDetailComponent } from './metric-groups-detail.component';

describe('MetricDetailComponent', () => {
  let component: MetricGroupsDetailComponent;
  let fixture: ComponentFixture<MetricGroupsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricGroupsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricGroupsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
