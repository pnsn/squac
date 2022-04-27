import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { WidgetService } from "./widget.service";
import { MockSquacApiService } from "@core/services/squacapi.service.mock";
import { SquacApiService } from "@core/services/squacapi.service";
import { Widget } from "@widget/models/widget";
import { ChannelGroupService } from "@channelGroup/services/channel-group.service";
import { MockChannelGroupService } from "@channelGroup/services/channel-group.service.mock";

describe("WidgetService", () => {
  const testData = {
    id: 1,
    name: "string",
    dashboard: {},
    description: "desc",
    widgettype: {},
    metrics: [],
    thresholds: [],
    columns: 1,
    rows: 1,
    x_position: 1,
    y_position: 1,
    stattype: {},
    channel_group: 1,
    user_id: "1",
    color_palette: "string",
  };

  let squacApiService;
  let widgetService: WidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: SquacApiService,
          useValue: new MockSquacApiService(testData),
        },
        { provide: ChannelGroupService, useClass: MockChannelGroupService },
      ],
    });

    widgetService = TestBed.inject(WidgetService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it("should be created", () => {
    const service: WidgetService = TestBed.inject(WidgetService);
    expect(service).toBeTruthy();
  });

  it("should get widgets with dashboard id", (done: DoneFn) => {
    widgetService.getWidgets(1).subscribe((widgets) => {
      expect(widgets.length).toEqual(1);
      done();
    });
  });

  it("should get widget with id", (done: DoneFn) => {
    widgetService.getWidget(1).subscribe((widget) => {
      expect(widget.id).toEqual(testData.id);
      done();
    });
  });

  it("should put widget with id", (done: DoneFn) => {
    const putSpy = spyOn(squacApiService, "put").and.callThrough();
    const testWidget = new Widget(1, 1, "", "", 1, 1, 1, 1, 1, 1, 1, []);
    widgetService.updateWidget(testWidget).subscribe(() => {
      expect(putSpy).toHaveBeenCalled();
      done();
    });
  });

  it("should post widget with id", (done: DoneFn) => {
    const postSpy = spyOn(squacApiService, "post").and.callThrough();
    const testWidget = new Widget(null, 1, "", "", 1, 1, 1, 1, 1, 1, 1, []);
    widgetService.updateWidget(testWidget).subscribe(() => {
      expect(postSpy).toHaveBeenCalled();
      done();
    });
  });

  it("should delete widget with id", (done: DoneFn) => {
    const deleteSpy = spyOn(squacApiService, "delete").and.callThrough();

    widgetService.deleteWidget(1).subscribe(() => {
      expect(deleteSpy).toHaveBeenCalled();
      done();
    });
  });
});
