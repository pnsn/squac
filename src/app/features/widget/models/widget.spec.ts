import { Widget } from "./widget";

describe("Widget", () => {
  it("should create an instance", () => {
    expect(
      new Widget(1, 1, "name", "description", 1, 1, 1, 1, 1, 1, 1, [])
    ).toBeTruthy();
  });

  it("should return empty array no metrics", () => {
    const widget = new Widget(
      1,
      1,
      "name",
      "description",
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      []
    );

    expect(widget.metricsIds).toEqual([]);
  });
});
