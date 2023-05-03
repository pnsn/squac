import { Alert } from "./alert";

describe("Alert", () => {
  it("should create an instance", () => {
    const testAlert = new Alert({
      id: 7,
      breachingChannels: [],
    });
    expect(testAlert.id).toBe(7);
    expect(testAlert).toBeDefined();
    testAlert.fromRaw({
      id: 8,
      timestamp: "",
      triggerId: 7,
      monitorId: 9,
      breaching_channels: "",
    });
    expect(testAlert.id).not.toEqual(7);
  });

  it("should return model name", () => {
    expect(Alert.modelName).toBe("Alert");
  });
});
