import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SquacApiService } from '@core/services/squacapi.service';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';
import { ChannelsService } from './channels.service';
import { Channel } from '@core/models/channel';

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
    'networkCode',
    '',
    ''
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

  it('should get channels with filters', (done: DoneFn) => {
    const filter = {net : 1};
    channelsService.getChannelsByFilters(filter).subscribe(channels => {
      expect(channels.length).toEqual(1);
      done();
    });
  });
});
