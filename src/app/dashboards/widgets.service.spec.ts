import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SquacApiService } from '.././squacapi.service';
import { MockSquacApiService } from '.././squacapi.service.mock';
import { WidgetsService } from './widgets.service';
import { Widget } from './widget';

describe('WidgetsService', () => {
  const testWidget: Widget = new Widget(
    1,
    "test",
    []
  );

  let squacApiService;
  let widgetsService: WidgetsService;
  const mockSquacApiService = new MockSquacApiService( testWidget );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: SquacApiService, useValue: mockSquacApiService
      }]
    });

    widgetsService = TestBed.get(WidgetsService);
    squacApiService = TestBed.get(SquacApiService);
  });

  it('should be created', () => {
    const service: WidgetsService = TestBed.get(WidgetsService);
    expect(service).toBeTruthy();
  });


  it('should get channel with id', (done: DoneFn) => {
    widgetsService.getWidget(1).subscribe(widget => {
      expect(widget.id).toEqual(testWidget.id);
      done();
    });
  });
});


