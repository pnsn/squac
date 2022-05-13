import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { WidgetModule } from "@features/widget/widget.module";
import { Widget } from "@widget/models/widget";
import { MockBuilder } from "ng-mocks";

import { MapComponent } from "./map.component";

fdescribe("MapComponent", () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(() => {
    return MockBuilder(MapComponent, WidgetModule)
      .mock(LeafletModule)
      .mock(LeafletDrawModule);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    component.data = {};
    component.metrics = [];
    component.selectedMetrics = [];
    component.channels = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
