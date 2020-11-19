import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmEditComponent } from './alarm-edit.component';

describe('AlarmEditComponent', () => {
  let component: AlarmEditComponent;
  let fixture: ComponentFixture<AlarmEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlarmEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
