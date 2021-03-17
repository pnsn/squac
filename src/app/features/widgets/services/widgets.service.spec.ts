import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { WidgetsService } from './widgets.service';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';
import { SquacApiService } from '@core/services/squacapi.service';
import { Widget } from '../models/widget';
import { StatTypeResolver } from '../stat-type.resolver';
import { ChannelGroupsService } from '@features/channel-groups/services/channel-groups.service';
import { MockChannelGroupsService } from '@features/channel-groups/services/channel-groups.service.mock';

describe('WidgetsService', () => {
  const testData = {
    id: 1,
    name: "string",
    dashboard: {},
    description: "desc",
    widgettype: {},
    metrics: [],
    thresholds:[],
    columns: 1, 
    rows: 1,
    x_position: 1,
    y_position: 1,
    stattype: {},
    channel_group: 1,
    user_id: "1",
    color_palette:"string"
  };

  let squacApiService;
  let widgetsService: WidgetsService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: SquacApiService, useValue: new MockSquacApiService( testData )},
        {provide: ChannelGroupsService, useClass: MockChannelGroupsService}
      ]
    });

    widgetsService = TestBed.inject(WidgetsService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it('should be created', () => {
    const service: WidgetsService = TestBed.inject(WidgetsService);
    expect(service).toBeTruthy();
  });

  it('should get widgets with dashboard id', (done: DoneFn) => {
    widgetsService.getWidgets(1).subscribe(widgets => {
      expect(widgets.length).toEqual(1);
      done();
    });
  });

  it('should get widget with id', (done: DoneFn) => {
    widgetsService.getWidget(1).subscribe(widget => {
      expect(widget.id).toEqual(testData.id);
      done();
    });
  });

  it('should put widget with id', (done: DoneFn) => {
    const putSpy = spyOn(squacApiService, 'put').and.callThrough();
    const testWidget = new Widget(1, 1, '', '', 1, 1, 1, 1, 1, 1, 1, []);
    widgetsService.updateWidget(testWidget).subscribe(
      widget => {
        expect(putSpy).toHaveBeenCalled();
        done();
      }
    );

  });

  it('should post widget with id', (done: DoneFn) => {
    const postSpy = spyOn(squacApiService, 'post').and.callThrough();
    const testWidget = new Widget(null, 1, '', '', 1, 1, 1, 1, 1, 1, 1, []);
    widgetsService.updateWidget(testWidget).subscribe(
      widget => {
        expect(postSpy).toHaveBeenCalled();
        done();
      }
    );

  });


  it('should delete widget with id', (done: DoneFn) => {
    const deleteSpy = spyOn(squacApiService, 'delete').and.callThrough();

    widgetsService.deleteWidget(1).subscribe(
      widget => {
        expect(deleteSpy).toHaveBeenCalled();
        done();
      }
    );

  });
});


