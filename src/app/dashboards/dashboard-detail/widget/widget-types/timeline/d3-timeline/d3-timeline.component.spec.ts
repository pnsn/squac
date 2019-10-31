import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3TimelineComponent } from './d3-timeline.component';

describe('D3TimelineComponent', () => {
  let component: D3TimelineComponent;
  let fixture: ComponentFixture<D3TimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3TimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
