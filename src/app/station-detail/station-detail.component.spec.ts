import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationDetaulComponent } from './station-detail.component';

describe('StationDetaulComponent', () => {
  let component: StationDetaulComponent;
  let fixture: ComponentFixture<StationDetaulComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationDetaulComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationDetaulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
