import { MockService } from "ng-mocks";
import { Monitor } from "./monitor";

describe("Monitor", () => {
  it("should create an instance", () => {
    expect(MockService(Monitor)).toBeTruthy();
  });

  it("should adapt from json to monitor", () => {
    const testData = {
      id: 1,
      url: "string",
      channel_group: 1,
      metric: 1,
      interval_type: "string",
      interval_count: 1,
      stat: "string",
      name: "string",
      created_at: "string",
      updated_at: "string",
      user: 1,
    };

    const monitor = new Monitor(testData);
    expect(monitor).toBeDefined();
  });
});
