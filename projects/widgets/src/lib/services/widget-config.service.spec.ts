import { TestBed } from "@angular/core/testing";
import { MockBuilder } from "ng-mocks";
import { Metric, WidgetProperties } from "squacapi";

import { WidgetConfigService } from "./widget-config.service";

describe("WidgetConfigService", () => {
  let service: WidgetConfigService;

  const metric1 = new Metric({ id: 1, name: "metric 1", unit: "" });
  const metric2 = new Metric({ id: 2, name: "metric 2", unit: "" });
  const metric3 = new Metric({ id: 3, name: "metric 3", unit: "" });

  let widgetProperties: WidgetProperties;

  beforeEach(() => {
    return MockBuilder(WidgetConfigService);
  });

  beforeEach(() => {
    service = TestBed.inject(WidgetConfigService);
    service.thresholds = [
      {
        min: 0,
        max: 10,
        metricId: 1,
      },
      {
        min: null,
        max: 10,
        metricId: 2,
      },
      {
        max: null,
        min: 1,
        metricId: 2,
      },
      {
        metricId: 3,
        min: null,
        max: null,
      },
    ];
    service.dataRange = {
      1: { min: 1, max: 22, count: 10 },
      2: { min: -10, max: 10, count: 20 },
      3: { min: 0, max: 100, count: 20 },
    };

    widgetProperties = {
      inRange: { color: ["#000", "#fff"] },
      outOfRange: { color: ["#808080"] },
    };
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should create continous visual maps from thresholds", () => {
    widgetProperties.numSplits = 0;
    const visualMaps = service.getVisualMapFromThresholds(
      [metric1, metric2, metric3],
      widgetProperties,
      1
    );
    const visualMap1 = visualMaps[metric1.id];
    expect(visualMap1).toBeDefined();
    expect(visualMap1.type).toBe("continuous");
  });
  it("should create piecewise visual maps from thresholds", () => {
    widgetProperties.numSplits = 3;

    const visualMaps = service.getVisualMapFromThresholds(
      [metric1, metric2, metric3],
      widgetProperties,
      1
    );
    const visualMap1 = visualMaps[metric1.id];
    expect(visualMap1).toBeDefined();
    expect(visualMap1.type).toBe("piecewise");
  });
  it("should create stoplight visual maps from thresholds", () => {
    widgetProperties.displayType = "stoplight";
    const visualMaps = service.getVisualMapFromThresholds(
      [metric1, metric2, metric3],
      widgetProperties,
      1
    );
    const visualMap1 = visualMaps[metric1.id];
    expect(visualMap1).toBeDefined();
    expect(visualMap1.type).toBe("stoplight");
  });

  // it("shuold calculate visual map pieces", () => {});

  // it("should check value in visual map", () => {});

  // it("should find the color that matches the value", () => {});

  // it("should create series for multi metrics", () => {});

  // it("should format tooltip for multimetrics", () => {});

  // it("should create tooltip for time axis", () => {});

  // it("should format time axis ticks", () => {});

  // it("should format time axis label", () => {});
});
