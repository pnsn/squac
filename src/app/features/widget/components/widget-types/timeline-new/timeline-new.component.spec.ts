import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineNewComponent } from './timeline-new.component';

describe('TimelineNewComponent', () => {
  let component: TimelineNewComponent;
  let fixture: ComponentFixture<TimelineNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
