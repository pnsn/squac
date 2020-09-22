import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SquacApiService } from '@core/services/squacapi.service';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';
import { ChannelGroupsService } from './channel-groups.service';
import { ChannelGroup } from '@core/models/channel-group';

describe('ChannelGroupsService', () => {
  let channelGroupsService: ChannelGroupsService;

  const testChannelGroup: ChannelGroup = new ChannelGroup(
    1,
    1,
    'name',
    'description',
    1,
    false,
    true,
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
    apiSpy = spyOn(squacApiService, 'put');
    channelGroupsService.updateChannelGroup(testChannelGroup).subscribe(
      channelGroup => {
        expect(apiSpy).toHaveBeenCalled();
        done();
      }
    );

  });

  it('should post channel group without id', (done: DoneFn) => {
    apiSpy = spyOn(squacApiService, 'post');

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
        expect(apiSpy).toHaveBeenCalled();
        done();
      }
    );

 
  });

  it('should delete dashboard', (done: DoneFn) => {
    channelGroupsService.deleteChannelGroup(1).subscribe(response => {
      expect(response).toBeTruthy();
      done();
    })
  });

});
