import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharingToggleComponent } from './sharing-toggle.component';

describe('SharingToggleComponent', () => {
  let component: SharingToggleComponent;
  let fixture: ComponentFixture<SharingToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharingToggleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharingToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
