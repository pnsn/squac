import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SquacApiService } from '@core/services/squacapi.service';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';
import { ChannelGroupsService } from './channel-groups.service';
import { ChannelGroup } from '@core/models/channel-group';
import { resolveSanitizationFn } from '@angular/compiler/src/render3/view/template';

describe('ChannelGroupsService', () => {
  let channelGroupsService: ChannelGroupsService;

  const testChannelGroup = {
    name: 'name',
    id: 1,
    url: 'url',
    description: 'description',
    channels: [],
    share_all: false,
    share_org: false,
    created_at: 'date',
    updated_at: 'date',
    user_id: '1',
    organization: 1
  };
  let squacApiService;

  const mockSquacApiService = new MockSquacApiService( testChannelGroup );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{provide: SquacApiService, useValue: mockSquacApiService}, ]
    });
    channelGroupsService = TestBed.inject(ChannelGroupsService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it('should be created', () => {
    const service: ChannelGroupsService = TestBed.inject(ChannelGroupsService);

    expect(service).toBeTruthy();
  });


  it('should get channelGroups', (done: DoneFn) => {
    channelGroupsService.getChannelGroups().subscribe(channelGroups => {
      expect(channelGroups[0].id).toEqual(testChannelGroup.id);
      done();
    });
  });

  it('should get channelGroup with id', (done: DoneFn) => {
    channelGroupsService.getChannelGroup(1).subscribe(channelGroup => {
      expect(channelGroup.id).toEqual(testChannelGroup.id);
      done();
    });
  });

  it('should put channel group with id', (done: DoneFn) => {
    const testGroup = new ChannelGroup(
      1,
      1,
      'name',
      'description',
      1,
      false,
      false,
      []
    );
    channelGroupsService.updateChannelGroup(testGroup).subscribe(
      response => {
        expect(response).toBeDefined();
        done();
      }
    );
  });

  it('should post channel group without id', (done: DoneFn) => {
    const newChannelGroup = new ChannelGroup(
      null,
      null,
      'name',
      'description',
      1,
      true,
      true,
      []
    );

    channelGroupsService.updateChannelGroup(newChannelGroup).subscribe(
      response => {
        expect(response).toBeDefined();
        done();
      }
    );

  });

  it('should delete dashboard', (done: DoneFn) => {
    channelGroupsService.deleteChannelGroup(1).subscribe(response => {
      expect(response).toBeTruthy();
      done();
    });
  });

});
