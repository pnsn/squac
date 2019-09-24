import { TestBed, ComponentFixture } from '@angular/core/testing';

import { NetworksService } from './networks.service';
import { SquacApiService } from '../squacapi';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Network } from './network';
import { of, Observable } from 'rxjs';
import { TestingCompiler } from '@angular/core/testing/src/test_compiler';
import { Injectable, inject } from '@angular/core';
import { MockSquacApiService } from '../squacapi.service.mock';

describe('NetworksService', () => {
  let networksService : NetworksService;
  let testData: Network = new Network(
    1,
    "code",
    "name",
    "description"
  );
  let squacApiService;
  let mockSquacApiService = new MockSquacApiService( testData );

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
      expect(networks).toEqual([testData]);
      done();
    });
    
  });

  it('should get network with id', (done: DoneFn)=>{
    networksService.getNetwork(1).subscribe(network => {
      expect(network).toEqual(testData);
      done();
    });
  });

});
