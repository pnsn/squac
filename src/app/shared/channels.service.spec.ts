import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SquacApiService } from '../squacapi';
import { MockSquacApiService } from '../squacapi.service.mock';
import { ChannelsService } from './channels.service';
import { Channel } from '../shared/channel';
import { Network } from '../channel-groups/network';

describe('ChannelsService', () => {
  let channelGroupsService : ChannelsService;

  let testChannel : Channel = new Channel(
    1,
    "code",
    "name",
    0,
    0,
    0,
    0,
    "loc",
    "stationCode",
    "networkCode"
  );
  let squacApiService;

  let apiSpy; 
  let mockSquacApiService = new MockSquacApiService( testChannel );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: SquacApiService, useValue: mockSquacApiService
      }]
    });

    channelGroupsService = TestBed.get(ChannelsService);
    squacApiService = TestBed.get(SquacApiService);
  });

  it('should be created', () => {
    const service: ChannelsService = TestBed.get(ChannelsService);

    expect(service).toBeTruthy();
  });


  it('should fetch channels', (done: DoneFn) => {
    channelGroupsService.fetchChannels(({code: "test"} as Network));
    
    channelGroupsService.channels.subscribe(channelGroups => {
      expect(channelGroups[0].id).toEqual(testChannel.id);
      done();
    });
    
  });

  it('should return channels', () => {
    channelGroupsService.channels.subscribe(channelGroups => {
      expect(channelGroups).toBeTruthy();
    });
  });

  it('should get channel with id', (done: DoneFn)=>{
    channelGroupsService.getChannel(1).subscribe(channelGroup => {
      expect(channelGroup.id).toEqual(testChannel.id);
      done();
    });
  });
});
