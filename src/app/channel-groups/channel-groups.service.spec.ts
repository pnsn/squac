import { TestBed } from '@angular/core/testing';
import { ChannelGroupsService } from './channel-groups.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChannelGroup } from '../shared/channel-group';

describe('ChannelGroupsService', () => {
  let httpClientSpy : { get : jasmine.Spy};
  let channelGroupsService : ChannelGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // imports: [HttpClientTestingModule]
    })
    // httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    channelGroupsService = TestBed.get(ChannelGroupsService);
  });

  it('should be created', () => {
    const service: ChannelGroupsService = TestBed.get(ChannelGroupsService);
    expect(service).toBeTruthy();
  });

  it('should return channelGroups', () => {
    expect(channelGroupsService.getChannelGroups()).toBeTruthy();
  });

  it('should get channelGroup from id', () => {
    expect(channelGroupsService.getChannelGroup(1)).toBeTruthy();
  });

  it('should add channelgroup', () => {
    const testGroup = new ChannelGroup(null, "channel group a", "channel group a description", []);

    const testID = channelGroupsService.addChannelGroup(testGroup);

    expect(channelGroupsService.getChannelGroup(testID)).toBeTruthy();
  });

  it('should update channel group', () => {
    const testGroup = new ChannelGroup(1, "test", "channel group a description", []);

    channelGroupsService.updateChannelGroup(1, testGroup);

    expect(channelGroupsService.getChannelGroup(1).name).toEqual("test");
  });

  it('should add new channel group if no id', () => {
    const testGroup = new ChannelGroup(null, "test", "channel group a description", []);

    const testID = channelGroupsService.updateChannelGroup(null, testGroup);

    expect(channelGroupsService.getChannelGroup(testID).name).toEqual("test");
  });
});
