import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SquacApiService } from '../../../core/services/squacapi.service';
import { MockSquacApiService } from '../../../core/services/squacapi.service.mock';
import { NetworksService } from './networks.service';
import { Network } from '../models/network';


describe('NetworksService', () => {
  let networksService: NetworksService;
  const testNetwork: Network = new Network(
    1,
    'code',
    'name',
    'description'
  );
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


  it('should fetch networks', (done: DoneFn) => {
    networksService.fetchNetworks();

    networksService.networks.subscribe(networks => {
      expect(networks).toEqual([testNetwork]);
      done();
    });

  });

  it('should get network with id', (done: DoneFn) => {
    networksService.getNetwork(1).subscribe(network => {
      expect(network).toEqual(testNetwork);
      done();
    });
  });

});
