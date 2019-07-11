import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMetricsComponent } from './edit-metrics.component';

describe('EditMetricsComponent', () => {
  let component: EditMetricsComponent;
  let fixture: ComponentFixture<EditMetricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMetricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
