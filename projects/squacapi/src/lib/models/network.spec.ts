import { Network } from "./network";

describe("Network", () => {
  it("should create an instance", () => {
    expect(new Network()).toBeTruthy();
    expect(Network.modelName).toBe("Network");
  });

  it("should adapt api json to Network", () => {
    const testData = {
      class_name: "class",
      code: "code",
      name: "testName",
      url: "url",
      description: "string",
      created_at: "string",
      updated_at: "string",
      user: 1,
    };

    const network = new Network(testData);
    expect(network).toBeDefined();
    expect(network.name).toBe("testName");
  });
});
