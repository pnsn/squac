import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationEditEntryComponent } from './organization-edit-entry.component';

describe('OrganizationEditEntryComponent', () => {
  let component: OrganizationEditEntryComponent;
  let fixture: ComponentFixture<OrganizationEditEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationEditEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationEditEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
