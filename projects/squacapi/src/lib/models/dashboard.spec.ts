import { Widget } from "../models";
import { Dashboard } from "./dashboard";

describe("Dashboard", () => {
  it("should create an instance", () => {
    const dashboard = new Dashboard({
      channel_group: 1,
    });
    expect(dashboard).toBeTruthy();
    expect(Dashboard.modelName).toBe("Dashboard");
    expect(dashboard.toJson()).toBeDefined();
  });

  it("should set properties on dashboard", () => {
    const dashboard = new Dashboard({
      properties: "",
      channel_group: 1,
    });

    expect(dashboard.properties).toBeDefined();

    dashboard.properties = "{}";

    expect(dashboard.properties).toBeDefined();

    dashboard.properties = {
      autoRefresh: false,
    };

    expect(dashboard.properties.autoRefresh).toBeFalse();

    const emptyDash = new Dashboard({
      properties: "invalid string",
    });

    expect(emptyDash.properties).toBeFalsy();
  });

  it("should handle widgets", () => {
    const dashboard = new Dashboard();

    const widget = new Widget({
      id: 1,
    });

    dashboard.widgets = [widget];

    expect(dashboard.widgets.length).toBe(1);
  });
});
