import { HttpClientTestingModule } from "@angular/common/http/testing";
import { fakeAsync, tick } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { OrganizationService } from "@features/user/services/organization.service";
import { UserService } from "@features/user/services/user.service";
import { SharedModule } from "@shared/shared.module";
import { NgxDatatableModule } from "@boring.devs/ngx-datatable";
import { MockBuilder, MockRender } from "ng-mocks";
import { BehaviorSubject } from "rxjs";
import { SearchFilterComponent } from "../search-filter/search-filter.component";
import { Location } from "@angular/common";
import { TableViewComponent } from "./table-view.component";

describe("TableViewComponent", () => {
  let component: TableViewComponent;
  let fixture;

  beforeEach(() => {
    return MockBuilder(TableViewComponent, SharedModule)
      .keep(NgxDatatableModule)
      .mock(SearchFilterComponent)
      .mock(HttpClientTestingModule)
      .mock(ActivatedRoute)
      .keep(
        RouterTestingModule.withRoutes([
          { path: "1", component: TableViewComponent },
          { path: "2", component: TableViewComponent },
        ])
      )
      .mock(OrganizationService)
      .mock(UserService, {
        user: new BehaviorSubject(null),
      });
  });

  beforeEach(() => {
    fixture = MockRender(
      TableViewComponent,
      {
        options: { test: true },
        controls: {},
        filters: {},
        rows: [],
        columns: [],
        selectedRowId: null,
        selectedRow: null,
      },
      { detectChanges: false }
    );
    component = fixture.point.injector.get(TableViewComponent);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should build columns", () => {
    expect(component.tableColumns).toBeUndefined();
    const testColumns = [
      {
        prop: "test",
      },
      {
        prop: "owner",
      },
      {
        prop: "orgId",
      },
      {
        prop: "name",
      },
    ];
    fixture.componentInstance.columns = testColumns;
    fixture.detectChanges();
    expect(component.tableColumns).toEqual(testColumns);
  });

  it("should build rows and filter", () => {
    expect(component.rows).toBeFalsy();
    const rows = [];
    fixture.componentInstance.rows = rows;
    fixture.detectChanges();
    expect(component.tableRows).toEqual(rows);
  });

  it("should listen to router events and set selected", fakeAsync(() => {
    fixture.componentInstance.controls.listenToRouter = true;
    fixture.componentInstance.controls.basePath = "/1";
    fixture.detectChanges();
    const router: Router = fixture.point.injector.get(Router);
    const location: Location = fixture.point.injector.get(Location);
    // First we need to initialize navigation.
    location.go("/1");
    if (fixture.ngZone) {
      fixture.ngZone.run(() => router.initialNavigation());
      tick(); // is needed for rendering of the current route.
    }
    location.go("/2");
    location.go("/1");
    // We should see Target1Component component on /1 page.
    expect(location.path()).toEqual("/1");

    expect(fixture.componentInstance.selectedRowId).toBeNull();
  }));

  it("should select row", () => {
    fixture.componentInstance.selectedRowId = 1;
    fixture.componentInstance.rows = [{ id: 1 }, { id: 2 }];
    fixture.detectChanges();

    expect(component.selectedRow).toEqual({ id: 1 });
  });

  it("should respond to row selected on table", () => {
    const resourceSpy = spyOn(component, "viewResource");
    fixture.componentInstance.selectedRowId = 1;
    fixture.componentInstance.rows = [{ id: 1 }, { id: 2 }];
    fixture.detectChanges();

    component.onSelect({ selected: [{ id: 1 }] });
    expect(component.clickCount).toEqual(1);

    component.onSelect({ selected: [{ id: 1 }] });

    component.onSelect({ selected: [{ id: 2 }] });
    expect(component.clickCount).toEqual(0);

    component.onSelect({ selected: [] });
    expect(component.clickCount).toEqual(0);

    expect(resourceSpy).toHaveBeenCalledTimes(1);
  });
});
