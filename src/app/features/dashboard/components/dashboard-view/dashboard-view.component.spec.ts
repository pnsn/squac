import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardViewComponent } from "./dashboard-view.component";
import { RouterTestingModule } from "@angular/router/testing";
import { MaterialModule } from "@shared/material.module";
import { AbilityModule } from "@casl/angular";
import { MockBuilder } from "ng-mocks";
import { TableViewComponent } from "@shared/components/table-view/table-view.component";
import { FormsModule } from "@angular/forms";
import { DashboardService } from "@features/dashboard/services/dashboard.service";

describe("DashboardViewComponent", () => {
  let component: DashboardViewComponent;
  let fixture: ComponentFixture<DashboardViewComponent>;

  beforeEach(() => {
    return MockBuilder(DashboardViewComponent)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(MaterialModule)
      .mock(AbilityModule)
      .mock(FormsModule)
      .mock(TableViewComponent)
      .mock(DashboardService);
  });

  it("should create", () => {
    fixture = TestBed.createComponent(DashboardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
