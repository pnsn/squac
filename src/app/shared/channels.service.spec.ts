import { TestBed } from '@angular/core/testing';
import { ChannelsService} from './channels.service';
import {of} from 'rxjs';
import { Channel } from './channel';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { asyncError, asyncData} from '../../testing/async-observables-helpers';
import { HttpErrorResponse } from '@angular/common/http';
describe('ChannelsService', () => {
  let httpClientSpy : { get : jasmine.Spy};
  let channelsService : ChannelsService;
  
  let expectedChannels : Channel[] = [
    new Channel (
      1,
      "cha",
      "channel",
      1,
      1.00,
      1.00,
      1,
      "--",
      "",
      ""
    )
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    channelsService = new ChannelsService(
      <any> httpClientSpy
    );

  });

  // it('should be created', () => {
  //   const service: ChannelsService = TestBed.get(ChannelsService);
  //   expect(service).toBeTruthy();
  // });

  // it('should set channels', () => {
  //   channelsService.setChannels(expectedChannels);

  //   channelsService.channels.subscribe(channels => {
  //     expect(channels).toBe(expectedChannels);
  //   });
  // });

  // it('should return channels from db (HttpClient called once)', () => {
  //   const networks : any[] =
  //     [
  //       { 
  //         code: "net",
  //         name: 'network',
  //         stations : [
  //           {
  //             code: "sta",
  //             name: "station",
  //             locations: [
  //               {
  //                 lat: 1.00,
  //                 lon: 1.00,
  //                 elev: 1,
  //                 code: "--",
  //                 channels: [
  //                   {
  //                     name: "channel",
  //                     code: "cha",
  //                     sample_rate: 1
  //                   }
  //                 ]
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     ];

  //   httpClientSpy.get.and.returnValue(asyncData(networks));
  
  //   channelsService.fetchChannels().subscribe(
  //     channels => expect(channels).toEqual(expectedChannels, 'expected channels'),
  //     fail
  //   );
  //   expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  // });

  // it('should return an error when the server returns a 404', () => {
  //   const errorResponse = new HttpErrorResponse({
  //     error: 'test 404 error',
  //     status: 404, statusText: 'Not Found'
  //   });
  
  //   httpClientSpy.get.and.returnValue(asyncError(errorResponse));
  
  //   channelsService.fetchChannels().subscribe(
  //     channels => fail('expected an error, not heroes'),
  //     (error : HttpErrorResponse)  => {
  //       expect(error).toContain('Something bad happened; please try again later')
  //     }
  //   );
  // });


});
