import { Location } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { fakeAsync, tick } from "@angular/core/testing";
import { MatMenuModule } from "@angular/material/menu";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { AbilityModule } from "@casl/angular";
import { SharedModule } from "@shared/shared.module";
import { UserService } from "@user/services/user.service";

import { MockBuilder, MockRender } from "ng-mocks";
import { BehaviorSubject } from "rxjs";
import { OrganizationService } from "squacapi";
import { SearchFilterComponent } from "@shared/components/search-filter/search-filter.component";
import { SharingToggleComponent } from "@shared/components/sharing-toggle/sharing-toggle.component";
import { TableViewComponent } from "./table-view.component";
import { MatTableModule } from "@angular/material/table";

fdescribe("TableViewComponent", () => {
  let component: TableViewComponent;
  let fixture;

  beforeEach(() => {
    return MockBuilder(TableViewComponent)
      .mock(SharedModule)

      .mock(SharingToggleComponent)
      .keep(HttpClientTestingModule)
      .mock([
        SearchFilterComponent,
        ActivatedRoute,
        AbilityModule,
        MatMenuModule,
        MatTableModule,
      ])
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
    const testRow = { id: 1 };
    fixture.componentInstance.rows = [testRow, { id: 2 }];
    fixture.detectChanges();
    fixture.componentInstance.selectedRowId = 1;
    fixture.detectChanges();

    expect(component.selection.isSelected(testRow)).toBeTrue();
  });

  // it("should respond to row selected on table", () => {
  //   const resourceSpy = spyOn(component, "viewResource");
  //   fixture.componentInstance.selectedRowId = 1;
  //   fixture.componentInstance.rows = [{ id: 1 }, { id: 2 }];
  //   fixture.detectChanges();

  //   component.onSelect({ selected: [{ id: 1 }] });
  //   expect(component.clickCount).toEqual(1);

  //   component.onSelect({ selected: [{ id: 1 }] });

  //   component.onSelect({ selected: [{ id: 2 }] });
  //   expect(component.clickCount).toEqual(0);

  //   component.onSelect({ selected: [] });
  //   expect(component.clickCount).toEqual(0);

  //   expect(resourceSpy).toHaveBeenCalledTimes(1);
  // });
});

// renders a table
// populates table with rows
// populates table with columns
// can sort
// displays userIds as names
// displays orgIds as organization names
// selects resources using Id
// emits resource id when selected on table
// renders menu options set up by config and responds
// navigation/evetns:
// allows resource deletion
// allows resource viewing
// allows resource editing
// allows resource creatio
// renders a search field that alters rows, emits results
// emits refresh event
// inputted controls and options affect view
