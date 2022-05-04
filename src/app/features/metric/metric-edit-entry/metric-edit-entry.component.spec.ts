import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricEditEntryComponent } from './metric-edit-entry.component';

describe('MetricEditEntryComponent', () => {
  let component: MetricEditEntryComponent;
  let fixture: ComponentFixture<MetricEditEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetricEditEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricEditEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
