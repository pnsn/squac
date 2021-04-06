import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SquacApiService } from '@core/services/squacapi.service';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';
import { NetworksService } from './networks.service';
import { Network } from '../models/network';


describe('NetworksService', () => {
  let networksService: NetworksService;
  const testNetwork = {
    class_name: 'string',
    code: 'code',
    name: 'name',
    url: 'url',
    description: 'desc',
    created_at: 'date',
    updated_at: 'date',
    user_id: '1'
  };
  let squacApiService;
  const mockSquacApiService = new MockSquacApiService( testNetwork );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: SquacApiService, useValue: mockSquacApiService }]
    });

    networksService = TestBed.inject(NetworksService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it('should be created', () => {
    const service: NetworksService = TestBed.inject(NetworksService);

    expect(service).toBeTruthy();
  });


  it('should fetch networks', () => {
    networksService.fetchNetworks();
    expect(networksService.networks[0].name).toEqual(testNetwork.name);
  });

});
