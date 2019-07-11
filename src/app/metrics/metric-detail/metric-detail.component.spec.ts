import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricDetailComponent } from './metric-detail.component';

describe('MetricDetailComponent', () => {
  let component: MetricDetailComponent;
  let fixture: ComponentFixture<MetricDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
