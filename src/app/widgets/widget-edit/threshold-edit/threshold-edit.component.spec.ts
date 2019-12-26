import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThresholdEditComponent } from './threshold-edit.component';
import {MatListModule } from '@angular/material/list';

describe('ThresholdEditComponent', () => {
  let component: ThresholdEditComponent;
  let fixture: ComponentFixture<ThresholdEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatListModule],
      declarations: [ ThresholdEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThresholdEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
