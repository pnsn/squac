import { Channel } from "./channel";

describe("Channel", () => {
  it("should create an instance", () => {
    expect(new Channel()).toBeTruthy();
  });

  it("should create new channel from api json", () => {
    const testData = {
      id: 1,
      class_name: "string",
      code: "code",
      name: "name",
      station_code: "string",
      station_name: "string",
      url: "string",
      description: "string",
      sample_rate: 1,
      network: "string",
      loc: "string",
      lat: 2,
      lon: 2,
      elev: 2,
      azimuth: 2,
      dip: 1,
      created_at: "string",
      updated_at: "string",
      user: 1,
      starttime: "string",
      endtime: "string",
      nslc: "string.string.string.string",
    };
    const channel = new Channel(testData);
    expect(channel).toBeDefined();
    expect(channel.id).toBe(1);
    expect(channel.staCode).toEqual("STRING.STRING");
    expect(Channel.modelName).toEqual("Channel");
  });

  it("should add nslc if channel does not have it", () => {
    const channel = new Channel({
      id: 1,
      station_code: "test",
      sample_rate: 1,
      network: "net",
      code: "hnz",
    });
    expect(channel.nslc).toBe("NET.TEST.--.HNZ");
  });
});
