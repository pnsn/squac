import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorEditEntryComponent } from './monitor-edit-entry.component';

describe('MonitorEditEntryComponent', () => {
  let component: MonitorEditEntryComponent;
  let fixture: ComponentFixture<MonitorEditEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorEditEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorEditEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
