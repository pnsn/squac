import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TabularComponent } from "./tabular.component";
import { ViewService } from "@dashboard/services/view.service";
import { WidgetConfigService } from "../../services/widget-config.service";
import { MockBuilder } from "ng-mocks";
import { WidgetConnectService } from "../../services/widget-connect.service";
import { of } from "rxjs";
import { WidgetManagerService } from "../../services/widget-manager.service";
import { MatLegacyTableModule as MatTableModule } from "@angular/material/legacy-table";
import { MatSortModule } from "@angular/material/sort";

describe("TabularComponent", () => {
  let component: TabularComponent;
  let fixture: ComponentFixture<TabularComponent>;

  beforeEach(() => {
    return MockBuilder(TabularComponent)
      .mock(ViewService)
      .mock(MatTableModule)
      .mock(MatSortModule)
      .mock(WidgetConfigService)
      .provide({
        provide: WidgetManagerService,
        useValue: {
          toggleKey$: of(),
          widgetType: {},
          resize$: of(),
          widgetConfig: {},
        },
      })
      .keep(WidgetConnectService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabularComponent);
    component = fixture.componentInstance;

    component.selectedMetrics = [];
    component.channels = [];
    component.properties = {};
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
