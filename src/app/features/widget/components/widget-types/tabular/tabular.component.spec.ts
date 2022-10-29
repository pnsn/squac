import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TabularComponent } from "./tabular.component";
import { ViewService } from "@core/services/view.service";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import { MockBuilder } from "ng-mocks";
import { WidgetConnectService } from "@features/widget/services/widget-connect.service";
import { of } from "rxjs";
import { WidgetManagerService } from "@features/widget/services/widget-manager.service";
import { NgxDatatableModule } from "@boring.devs/ngx-datatable";

describe("TabularComponent", () => {
  let component: TabularComponent;
  let fixture: ComponentFixture<TabularComponent>;

  beforeEach(() => {
    return MockBuilder(TabularComponent)
      .mock(ViewService)
      .mock(WidgetTypeService)
      .mock(NgxDatatableModule)
      .provide({
        provide: WidgetManagerService,
        useValue: {
          toggleKey: of(),
          widgetType: {},
        },
      })
      .provide({
        provide: WidgetConnectService,
        useValue: {
          deemphasizeChannel: of(),
          emphasizedChannel: of(),
        },
      });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabularComponent);
    component = fixture.componentInstance;
    component.data = {};
    component.selectedMetrics = [];
    component.channels = [];
    component.properties = {};
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
