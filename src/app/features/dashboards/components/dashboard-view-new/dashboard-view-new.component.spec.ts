import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardViewNewComponent } from './dashboard-view-new.component';

describe('DashboardViewNewComponent', () => {
  let component: DashboardViewNewComponent;
  let fixture: ComponentFixture<DashboardViewNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardViewNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardViewNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
