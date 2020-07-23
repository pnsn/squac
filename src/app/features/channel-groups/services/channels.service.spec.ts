import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SquacApiService } from './squacapi.service';
import { MockSquacApiService } from './squacapi.service.mock';
import { ChannelsService } from './channels.service';
import { Channel } from '../models/channel';
import { Network } from '../../features/channel-groups/models/network';

describe('ChannelsService', () => {
  let channelsService: ChannelsService;

  const testChannel: Channel = new Channel(
    1,
    'code',
    'name',
    0,
    0,
    0,
    0,
    'loc',
    'stationCode',
    'networkCode'
  );
  let squacApiService;
  const mockSquacApiService = new MockSquacApiService( testChannel );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: SquacApiService, useValue: mockSquacApiService
      }]
    });

    channelsService = TestBed.inject(ChannelsService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it('should be created', () => {
    const service: ChannelsService = TestBed.inject(ChannelsService);

    expect(service).toBeTruthy();
  });

  it('should return channels', () => {
    channelsService.channels.subscribe(channels => {
      expect(channels).toBeTruthy();
    });
  });

  it('should get channel with id', (done: DoneFn) => {
    channelsService.getChannel(1).subscribe(channel => {
      expect(channel.id).toEqual(testChannel.id);
      done();
    });
  });

  it('should get channels with filters', (done: DoneFn) => {
    const filter = {net : 1};
    channelsService.getChannelsByFilters(filter).subscribe(channels => {
      expect(channels.length).toEqual(1);
      done();
    });
  });
});
