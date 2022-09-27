import { TestBed } from "@angular/core/testing";
import { MockService } from "ng-mocks";
import { ApiGetTrigger, Trigger, TriggerAdapter } from "./trigger";

describe("Trigger", () => {
  let adapter: TriggerAdapter;
  it("should create an instance", () => {
    expect(MockService(Trigger)).toBeTruthy();
  });

  it("should adapt from api to trigger", () => {
    adapter = TestBed.inject(TriggerAdapter);

    const testData: ApiGetTrigger = {
      id: 1,
      url: "string",
      monitor: 2,
      val1: 1,
      val2: 1,
      value_operator: "string", //outsideof, within, ==, <, <=, >, >=
      num_channels: 1,
      num_channels_operator: "string", //any, ==, <, >
      created_at: "string",
      updated_at: "string",
      user: 1,
      alert_on_out_of_alarm: false,
      email_list: "string", //comma separated
    };

    const trigger = adapter.adaptFromApi(testData);
    expect(trigger).toBeDefined();
  });

  it("should adapt from trigger to api", () => {
    adapter = TestBed.inject(TriggerAdapter);
    const trigger = MockService(Trigger);
    const triggerJson = adapter.adaptToApi(trigger);
    expect(triggerJson).toBeDefined();
  });
});
