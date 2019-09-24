import { TestBed } from '@angular/core/testing';

import { SquacApiService } from '../squacapi';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockSquacApiService } from '../squacapi.service.mock';
import { Network } from './network';
import { ChannelGroupsService } from './channel-groups.service';

describe('NetworksService', () => {
  let networksService : ChannelGroupsService;

  let testChannelGroup : Network = new Network(
    1,
    "code",
    "name",
    "description"
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: SquacApiService, useClass: MockSquacApiService
      }]
    });

    // networksService = TestBed.get(NetworksService);
  });

  // it('should be created', () => {
  //   const service: NetworksService = TestBed.get(NetworksService);

  //   expect(service).toBeTruthy();
  // });


  // it('should fetch networks', (done: DoneFn) => {
  //   networksService.fetchNetworks();
    
  //   networksService.networks.subscribe(networks => {
  //     expect(networks).toEqual([]);
  //     done();
  //   });
    
  // });

  // it('should return channelGroups', () => {
  //   expect(channelGroupsService.getChannelGroups()).toBeTruthy();
  // });

  // it('should get channelGroup from id', () => {
  //   expect(channelGroupsService.getChannelGroup(1)).toBeTruthy();
  // });

  // it('should add channelgroup', () => {
  //   const testGroup = new ChannelGroup(null, "channel group a", "channel group a description", []);

  //   const testID = channelGroupsService.addChannelGroup(testGroup);

  //   expect(channelGroupsService.getChannelGroup(testID)).toBeTruthy();
  // });

  // it('should update channel group', () => {
  //   const testGroup = new ChannelGroup(1, "test", "channel group a description", []);

  //   channelGroupsService.updateChannelGroup(1, testGroup);

  //   expect(channelGroupsService.getChannelGroup(1).name).toEqual("test");
  // });

  // it('should add new channel group if no id', () => {
  //   const testGroup = new ChannelGroup(null, "test", "channel group a description", []);

  //   const testID = channelGroupsService.updateChannelGroup(null, testGroup);

  //   expect(channelGroupsService.getChannelGroup(testID).name).toEqual("test");
  // });
});
