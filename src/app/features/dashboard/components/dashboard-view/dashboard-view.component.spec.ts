import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardViewComponent } from "./dashboard-view.component";
import { BehaviorSubject } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { MaterialModule } from "@shared/material.module";
import { AbilityModule } from "@casl/angular";
import { UserService } from "@user/services/user.service";
import { MockBuilder } from "ng-mocks";
import { TableViewComponent } from "@shared/components/table-view/table-view.component";
import { OrganizationService } from "@features/user/services/organization.service";
import { FormsModule } from "@angular/forms";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

describe("DashboardViewComponent", () => {
  let component: DashboardViewComponent;
  let fixture: ComponentFixture<DashboardViewComponent>;

  beforeEach(() => {
    return MockBuilder(DashboardViewComponent)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(MaterialModule)
      .mock(AbilityModule)
      .mock(FormsModule)
      .mock(NgxDatatableModule)
      .mock(TableViewComponent)
      .mock(OrganizationService)
      .mock(UserService, {
        user: new BehaviorSubject(null),
      });
  });

  it("should create", () => {
    fixture = TestBed.createComponent(DashboardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
