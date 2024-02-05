import { ReadOnlyTriggerSerializer } from "@pnsn/ngx-squacapi-client";
import { Trigger } from "./trigger";

describe("Trigger", () => {
  it("should create an instance from api data", () => {
    const testData: ReadOnlyTriggerSerializer = {
      monitor: 1,
      id: 2,
      created_at: "",
      updated_at: "",
      val1: 0,
      num_channels_operator: "all",
      value_operator: "<",
      user: 1,
      emails: "email@email.com",
      alert_on_out_of_alarm: false,
    };
    const trigger = new Trigger(testData);
    expect(trigger).toBeDefined();
    expect(trigger.owner).toBe(1);
    expect(Trigger.modelName).toBe("Trigger");
  });

  it("should create formatted strings for number of channels", () => {
    const testTrigger = new Trigger({
      monitor: 1,
      val1: 0,
      value_operator: "<",
      num_channels: 10,
      num_channels_operator: ">",
      emails: "",
      alert_on_out_of_alarm: true,
    });

    expect(testTrigger.numChannelsString).toBe("more than 10 channels");

    testTrigger.numChannelsOperator = "any";
    testTrigger.numChannels = null;
    expect(testTrigger.numChannelsString).toBe("any channel");
  });

  it("should create value string", () => {
    const testTrigger = new Trigger({
      monitor: 1,
      val1: 0,
      value_operator: "<",
      num_channels: 10,
      num_channels_operator: ">",
      emails: "",
      alert_on_out_of_alarm: true,
    });

    expect(testTrigger.valueString).toBe("less than 0");

    testTrigger.valueOperator = "outsideof";
    testTrigger.val2 = 1;

    expect(testTrigger.valueString).toBe("outside of 0 and 1");

    expect(testTrigger.fullString).toBe(
      "more than 10 channels outside of 0 and 1"
    );
  });

  it("should return the most recent alert info if exists", () => {
    const testTrigger = new Trigger({
      monitor: 1,
      val1: 0,
      value_operator: "<",
      num_channels: 10,
      num_channels_operator: ">",
      emails: "",
      alert_on_out_of_alarm: true,
    });

    expect(testTrigger.inAlarm).toBeUndefined();
    expect(testTrigger.lastUpdate).toBeUndefined();

    const triggerWithAlert = new Trigger({
      monitor: 1,
      val1: 0,
      value_operator: "<",
      num_channels: 10,
      num_channels_operator: ">",
      emails: "",
      alert_on_out_of_alarm: true,
      latest_alert: {
        trigger: 1,
        timestamp: "00:00:01Z",
        in_alarm: true,
      },
    });

    expect(triggerWithAlert.inAlarm).toBeTrue();
    expect(triggerWithAlert.lastUpdate).toBe("00:00:01");
  });

  it("should serialize object to json", () => {
    const testTrigger = new Trigger({
      monitor: 1,
      val1: 0,
      value_operator: "<",
      num_channels: 10,
      num_channels_operator: ">",
      emails: "",
      alert_on_out_of_alarm: true,
    });

    const json = testTrigger.toJson();

    expect(json).toEqual({
      monitor: 1,
      val1: 0,
      val2: undefined,
      value_operator: "<",
      num_channels: 10,
      num_channels_operator: ">",
      alert_on_out_of_alarm: true,
      emails: "",
    });
  });
});
