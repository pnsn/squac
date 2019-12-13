import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThresholdEditComponent } from './threshold-edit.component';

describe('ThresholdEditComponent', () => {
  let component: ThresholdEditComponent;
  let fixture: ComponentFixture<ThresholdEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
