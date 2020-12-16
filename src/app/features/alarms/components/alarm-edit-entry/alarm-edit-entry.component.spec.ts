import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmEditEntryComponent } from './alarm-edit-entry.component';

describe('AlarmEditEntryComponent', () => {
  let component: AlarmEditEntryComponent;
  let fixture: ComponentFixture<AlarmEditEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlarmEditEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmEditEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
