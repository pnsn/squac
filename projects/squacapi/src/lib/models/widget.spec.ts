import { Widget } from "./widget";

describe("Widget", () => {
  it("should create an instance", () => {
    expect(new Widget(1, 1, "name", 1, [], "mean")).toBeTruthy();
  });

  it("should return empty array no metrics", () => {
    const widget = new Widget(1, 1, "name", 1, [], "mean");

    expect(widget.metricsIds).toEqual([]);
  });
});