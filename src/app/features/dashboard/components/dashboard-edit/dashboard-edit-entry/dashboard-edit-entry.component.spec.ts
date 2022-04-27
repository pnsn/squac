import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DashboardEditEntryComponent } from "./dashboard-edit-entry.component";

describe("DashboardEditEntryComponent", () => {
  let component: DashboardEditEntryComponent;
  let fixture: ComponentFixture<DashboardEditEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardEditEntryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardEditEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
