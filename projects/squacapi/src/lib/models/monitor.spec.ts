import { MockService } from "ng-mocks";
import { Monitor } from "./monitor";

describe("Monitor", () => {
  it("should create an instance", () => {
    const monitor = new Monitor({
      id: 1,
      triggers: [],
    });

    expect(monitor).toBeTruthy();
    expect(monitor.inAlarm).toBeUndefined();
    expect(monitor.lastUpdate).toBeUndefined();
    expect(monitor.toJson()).toBeDefined();
    expect(Monitor.modelName).toBe("Monitor");
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
      triggers: [
        {
          latest_alert: { timestamp: "2010-01-01", in_alarm: true },
        },
        {
          latest_alert: { timestamp: "2020-01-01", in_alarm: true },
        },
      ],
      user: 1,
    };

    const monitor = new Monitor(testData);
    expect(monitor).toBeDefined();
    expect(monitor.inAlarm).toBeTrue();
    expect(monitor.lastUpdate).toBe("2020-01-01");
  });
});
