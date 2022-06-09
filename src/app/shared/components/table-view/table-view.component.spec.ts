import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { OrganizationService } from "@features/user/services/organization.service";
import { UserService } from "@features/user/services/user.service";
import { SharedModule } from "@shared/shared.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { MockBuilder } from "ng-mocks";
import { BehaviorSubject } from "rxjs";
import { SearchFilterComponent } from "../search-filter/search-filter.component";

import { TableViewComponent } from "./table-view.component";

describe("TableViewComponent", () => {
  let component: TableViewComponent;
  let fixture: ComponentFixture<TableViewComponent>;

  beforeEach(() => {
    return MockBuilder(TableViewComponent, SharedModule)
      .keep(NgxDatatableModule)
      .mock(SearchFilterComponent)
      .mock(HttpClientTestingModule)
      .mock(ActivatedRoute)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(OrganizationService)
      .mock(UserService, {
        user: new BehaviorSubject(null),
      });
  });

  it("should create", () => {
    fixture = TestBed.createComponent(TableViewComponent);
    component = fixture.componentInstance;
    component.options = {};
    component.controls = {};
    component.filters = {};
    component.rows = [];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
