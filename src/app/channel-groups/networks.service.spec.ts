import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SquacApiService } from '../squacapi';
import { MockSquacApiService } from '../squacapi.service.mock';
import { NetworksService } from './networks.service';
import { Network } from './network';


describe('NetworksService', () => {
  let networksService : NetworksService;
  let testNetwork: Network = new Network(
    1,
    "code",
    "name",
    "description"
  );
  let squacApiService;
  let mockSquacApiService = new MockSquacApiService( testNetwork );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: SquacApiService, useValue: mockSquacApiService }]
    });

    networksService = TestBed.get(NetworksService);
    squacApiService = TestBed.get(SquacApiService);
  });

  it('should be created', () => {
    const service: NetworksService = TestBed.get(NetworksService);

    expect(service).toBeTruthy();
  });


  it('should fetch networks', (done: DoneFn) => {
    networksService.fetchNetworks();
    
    networksService.networks.subscribe(networks => {
      expect(networks).toEqual([testNetwork]);
      done();
    });
    
  });

  it('should get network with id', (done: DoneFn)=>{
    networksService.getNetwork(1).subscribe(network => {
      expect(network).toEqual(testNetwork);
      done();
    });
  });

});
