import { TestBed } from '@angular/core/testing';
import { Channel } from './channel';
import { ApiGetChannelGroup, ChannelGroup, ChannelGroupAdapter } from './channel-group';

describe('ChannelGroup', () => {
  let adapter : ChannelGroupAdapter;

  it('should create an instance', () => {
    expect(new ChannelGroup(
      1,
      1,
      'test',
      'description',
      1,
      true,
      true,
      []
    )).toBeTruthy();
  });

  it('should create new channel group from api', () => {
    adapter = TestBed.inject(ChannelGroupAdapter);
    const testData: ApiGetChannelGroup = {
      name: "string",
      id: 1,
      url: "string",
      description: "string",
      channels:[],
      share_all: false,
      share_org: false,
      created_at: "string",
      updated_at: "string",
      user_id: "1",
      organization: 1
    }
    const channelGroup = adapter.adaptFromApi(testData);
    expect(channelGroup).toBeDefined();
    expect(channelGroup.id).toBe(1);
  });

  it('should return api json from channel group', () => {
    adapter = TestBed.inject(ChannelGroupAdapter);
    const testGroup: ChannelGroup = new ChannelGroup(
      1,
      1,
      "testName",
      "description",
      1,
      false,
      false,
      []
    );
    const channelGroupJson = adapter.adaptToApi(testGroup);
    expect(channelGroupJson).toBeDefined();
    expect(channelGroupJson.name).toBe("testName");
  });
});
