import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SquacApiService } from '../../../core/services/squacapi.service';
import { MockSquacApiService } from '../../../core/services/squacapi.service.mock';
import { ChannelGroupsService } from './channel-groups.service';
import { ChannelGroup } from '../../../core/models/channel-group';

describe('ChannelGroupsService', () => {
  let channelGroupsService: ChannelGroupsService;

  const testChannelGroup: ChannelGroup = new ChannelGroup(
    1,
    1,
    'name',
    'description',
    false,
    []
  );
  let squacApiService;

  let apiSpy;
  const mockSquacApiService = new MockSquacApiService( testChannelGroup );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: SquacApiService, useValue: mockSquacApiService
      }]
    });

    channelGroupsService = TestBed.inject(ChannelGroupsService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it('should be created', () => {
    const service: ChannelGroupsService = TestBed.inject(ChannelGroupsService);

    expect(service).toBeTruthy();
  });


  it('should fetch channelGroups', (done: DoneFn) => {
    channelGroupsService.fetchChannelGroups();

    channelGroupsService.getChannelGroups.subscribe(channelGroups => {
      expect(channelGroups[0].id).toEqual(testChannelGroup.id);
      done();
    });

  });

  it('should return channelGroups', () => {
    channelGroupsService.getChannelGroups.subscribe(channelGroups => {
      expect(channelGroups).toBeTruthy();
    });
  });

  it('should get channelGroup with id', (done: DoneFn) => {
    channelGroupsService.getChannelGroup(1).subscribe(channelGroup => {
      expect(channelGroup.id).toEqual(testChannelGroup.id);
      done();
    });
  });

  it('should update channel group', (done: DoneFn) => {
    channelGroupsService.updateChannelGroup(testChannelGroup);

    channelGroupsService.getChannelGroup(1).subscribe(channelGroup => {
      expect(channelGroup.name).toEqual(testChannelGroup.name);
      done();
    });
  });

  it('should put channel group with id', () => {
    apiSpy = spyOn(squacApiService, 'put');

    channelGroupsService.updateChannelGroup(testChannelGroup);

    expect(apiSpy).toHaveBeenCalled();
  });

  it('should post channel group without id', () => {
    apiSpy = spyOn(squacApiService, 'post');

    const newChannelGroup = new ChannelGroup(
      null,
      null,
      'name',
      'description',
      true,
      []
    );

    channelGroupsService.updateChannelGroup(newChannelGroup);

    expect(apiSpy).toHaveBeenCalled();
  });
});
