import { Channel } from "squacapi";
import { ChannelGroup } from "./channel-group";

describe("ChannelGroup", () => {
  const testChannel = new Channel({ id: 1 });
  it("should create an instance", () => {
    expect(new ChannelGroup()).toBeTruthy();
  });

  it("should create new channel group from api", () => {
    const testData = {
      id: 1,
    };
    const channelGroup = new ChannelGroup(testData);
    expect(channelGroup).toBeDefined();
    expect(channelGroup.id).toBe(1);
  });

  it("should correctly serialize", () => {
    const testData = {
      name: "string",
      id: 1,
      description: "string",
      created_at: "string",
      updated_at: "string",
      user: 1,
      organization: 1,
      channels: [testChannel],
      auto_exclude_channels: [testChannel],
      auto_include_channels: [testChannel],
      share_org: true,
      share_all: false,
    };
    const channelGroup = new ChannelGroup(testData);

    const data = channelGroup.toJson();
    expect(data.name).toEqual(testData.name);

    const channelGroup2 = new ChannelGroup({
      id: 1,
    });
    expect(channelGroup2.toJson()).toBeDefined();
  });

  it("should return model name", () => {
    expect(ChannelGroup.modelName).toBe("ChannelGroup");
  });
});
