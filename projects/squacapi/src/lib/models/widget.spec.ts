import { ReadOnlyWidgetDetailSerializer } from "@pnsn/ngx-squacapi-client";
import { WidgetLayout } from "squacapi";
import { WIDGET_LAYOUT, WIDGET_PROPERTIES } from "../constants";
import { Threshold, WidgetProperties } from "../interfaces";
import { Metric } from "./metric";
import { Widget } from "./widget";

describe("Widget", () => {
  it("should create an instance with defaults", () => {
    const widget = new Widget();

    expect(widget).toBeDefined();
    expect(Widget.modelName).toBe("Widget");
  });

  it("should serialize and deserialize api data", () => {
    const testData: ReadOnlyWidgetDetailSerializer = {
      id: 1,
      dashboard: 2,
      name: "Widget Name",
      metrics: [
        {
          id: 1,
          name: "Test Metric",
          code: "test_metric",
          unit: "any",
          reference_url: "",
        },
      ],
      thresholds: "",
      user: 1,
      type: "tabular",
      stat: "average",
    };

    const testWidget = new Widget(testData);

    expect(testWidget).toBeDefined();

    const json = testWidget.toJson();
    expect(json).toEqual({
      name: testData.name,
      metrics: [1],
      dashboard: testData.dashboard,
      type: testData.type,
      stat: testData.stat,
      layout: JSON.stringify(WIDGET_LAYOUT),
      properties: JSON.stringify(WIDGET_PROPERTIES),
      thresholds: JSON.stringify([]),
    });
  });

  it("should apply widget properties", () => {
    const widgetNoProps = new Widget({});
    expect(widgetNoProps.properties).toEqual(WIDGET_PROPERTIES);

    const testProps: WidgetProperties = {
      showLegend: false,
      inRange: { color: [], type: "color" },
    };
    const widgetWithProps = new Widget({ properties: testProps });
    expect(widgetWithProps.properties).toEqual(testProps);

    const widgetWithStringProps = new Widget({
      properties: JSON.stringify(testProps),
    });

    expect(widgetWithStringProps.properties).toEqual(testProps);

    const widgetWithBadProps = new Widget({ properties: "can't parse this" });
    expect(widgetWithBadProps.properties).toEqual(WIDGET_PROPERTIES);
  });

  it("should apply widget thresholds", () => {
    const widget = new Widget();
    expect(widget.thresholds).toBeUndefined();
    const widgetNoThresholds = new Widget({});
    expect(widgetNoThresholds.thresholds).toEqual([]);

    const testThresholds: Threshold[] = [
      {
        min: 0,
        max: 10,
        metricId: 1,
        inRange: { color: [], type: "color" },
      },
    ];
    const widgetWithThresholds = new Widget({ thresholds: testThresholds });
    expect(widgetWithThresholds.thresholds).toEqual(testThresholds);

    const widgetWithStringThresholds = new Widget({
      thresholds: JSON.stringify(testThresholds),
    });

    expect(widgetWithStringThresholds.thresholds).toEqual(testThresholds);

    const widgetWithBadThresholds = new Widget({
      thresholds: "can't parse this",
    });
    expect(widgetWithBadThresholds.thresholds).toEqual([]);
  });

  it("should apply widget layout", () => {
    const widgetNoLayout = new Widget({});
    expect(widgetNoLayout.layout).toEqual(WIDGET_LAYOUT);

    const testLayout: WidgetLayout = {
      x: 1,
      y: 0,
      rows: 1,
      columns: 1,
    };

    const widgetWithLayout = new Widget({ layout: testLayout });
    expect(widgetWithLayout.layout).toEqual(testLayout);

    const widgetWithStringLayout = new Widget({
      layout: JSON.stringify(testLayout),
    });

    expect(widgetWithStringLayout.layout).toEqual(testLayout);

    const widgetWithBadLayout = new Widget({
      layout: "can't parse this",
    });
    expect(widgetWithBadLayout.layout).toEqual(WIDGET_LAYOUT);
  });

  it("should be valid if widget has name, metrics, type, and stat", () => {
    const widget = new Widget({});
    expect(widget.isValid).toBeFalse();

    widget.name = "widget name";
    expect(widget.isValid).toBeFalse();

    widget.type = "type";
    expect(widget.isValid).toBeFalse();

    widget.metrics = [new Metric()];
    expect(widget.isValid).toBeFalse();

    widget.stat = "latest";
    expect(widget.name).toBeDefined();
    expect(widget.type).toBeDefined();
    expect(widget.metrics).toBeDefined();
    expect(widget.stat).toBeDefined();
    expect(widget.isValid).toBeTrue();
  });
});
