import { TestBed } from "@angular/core/testing";
import { MockService } from "ng-mocks";
import { Alert, AlertAdapter, ApiGetAlert } from "./alert";
import { ApiGetTrigger } from "./trigger";

describe("Alert", () => {
  let adapter: AlertAdapter;
  it("should create an instance", () => {
    expect(MockService(Alert)).toBeTruthy();
  });

  it("should adapt from api to Alert", () => {
    adapter = TestBed.inject(AlertAdapter);
    const trigger: ApiGetTrigger = {
      id: 1,
      url: "string",
      monitor: 2,
      val1: 1,
      val2: 2,
      value_operator: "string", //outsideof, within, ==, <, <=, >, >=
      num_channels: 2,
      num_channels_operator: "string", //any, ==, <, >
      created_at: "string",
      updated_at: "string",
      user: 1,
      alert_on_out_of_alarm: false,
      email_list: "string", //comma separated
    };

    const testData: ApiGetAlert = {
      id: 1,
      url: "urlString",
      trigger,
      timestamp: "string",
      message: "string",
      in_alarm: false,
      breaching_channels: [],
      created_at: "string",
      updated_at: "ng",
      user: 1,
    };

    const alert = adapter.adaptFromApi(testData);
    expect(alert).toBeDefined();
    expect(alert.inAlarm).toBe(false);
  });
});
