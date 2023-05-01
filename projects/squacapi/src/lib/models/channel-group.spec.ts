import { ChannelGroup } from "./channel-group";

describe("ChannelGroup", () => {
  it("should create an instance", () => {
    expect(new ChannelGroup()).toBeTruthy();
  });

  it("should create new channel group from api", () => {
    const testData = {
      name: "string",
      id: 1,
      description: "string",
      channels: [],
      created_at: "string",
      updated_at: "string",
      user: 1,
      organization: 1,
      auto_exclude_channels: [],
      auto_include_channels: [],
      share_org: true,
      share_all: false,
    };
    const channelGroup = new ChannelGroup(testData);
    expect(channelGroup).toBeDefined();
    expect(channelGroup.id).toBe(1);
  });
});
