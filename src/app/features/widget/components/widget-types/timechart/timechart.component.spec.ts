import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimechartComponent } from './timechart.component';

describe('TimechartComponent', () => {
  let component: TimechartComponent;
  let fixture: ComponentFixture<TimechartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimechartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
