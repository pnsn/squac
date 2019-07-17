import { TestBed } from '@angular/core/testing';

import { ChannelGroupsService } from './channel-groups.service';

describe('ChannelGroupsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChannelGroupsService = TestBed.get(ChannelGroupsService);
    expect(service).toBeTruthy();
  });
});
