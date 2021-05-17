import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedIndicatorComponent } from './shared-indicator.component';

describe('SharedIndicatorComponent', () => {
  let component: SharedIndicatorComponent;
  let fixture: ComponentFixture<SharedIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
