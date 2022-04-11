import { TestBed } from "@angular/core/testing";
import { MockService } from "ng-mocks";
import { Monitor, MonitorAdapter, ApiGetMonitor } from "./monitor";

describe("Monitor", () => {
  let adapter: MonitorAdapter;
  it("should create an instance", () => {
    expect(MockService(Monitor)).toBeTruthy();
  });

  it("should adapt from json to monitor", () => {
    adapter = TestBed.inject(MonitorAdapter);

    const testData: ApiGetMonitor = {
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
      user_id: "string",
    };

    const monitor = adapter.adaptFromApi(testData);
    expect(monitor).toBeDefined();
  });

  it("should adapt from monitor to json", () => {
    adapter = TestBed.inject(MonitorAdapter);

    const monitor = MockService(Monitor);

    const monitorJson = adapter.adaptToApi(monitor);
    expect(monitorJson).toBeDefined();
  });
});
