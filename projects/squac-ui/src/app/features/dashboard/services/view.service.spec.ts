import { TestBed } from "@angular/core/testing";
import { Ability } from "@casl/ability";
import { ChannelGroupService, Dashboard } from "squacapi";
import { DashboardService } from "squacapi";
import { Widget } from "widgets";
import { WidgetService } from "squacapi";
import * as dayjs from "dayjs";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";
import { take } from "rxjs/operators";
import { DateService } from "../../../core/services/date.service";
import { MessageService } from "../../../core/services/message.service";
import { ViewService } from "./view.service";
import { AppModule } from "../../../app.module";

describe("ViewService", () => {
  let service: ViewService;
  let widgetService;
  let dashboardService;
  const testWidget = new Widget({
    id: 1,
    user: 1,
    name: "name",
    organization: 1,
    metrics: [],
  });
  let testDashboard;
  // const mockSquacApiService = new MockSquacApiService( testMetric );

  beforeEach(() => {
    return MockBuilder(ViewService, AppModule)
      .mock(WidgetService)
      .provide({
        provide: ChannelGroupService,
        useValue: {
          read: (_i) => of(),
        },
      })
      .provide({
        provide: DashboardService,
        useValue: {
          list: (i) => of(i),
          update: (_i) => of(true),
          delete: (_i) => of(true),
          updateOrCreate: (_i) => of(true),
          partialUpdate: (_i) => of(true),
        },
      })
      .mock(MessageService)
      .provide({
        provide: DateService,
        useValue: {
          parseUtc: (date) => {
            return dayjs.utc(date).clone();
          },
          subtractFromNow: (amount: number, unit: string) => {
            const mT = unit as dayjs.ManipulateType;
            return dayjs().subtract(amount, mT);
          },
          // format date
          format: (date: dayjs.Dayjs) => {
            return date.format();
          },
          now: () => {
            return dayjs();
          },
          findRangeFromSeconds: () => {
            return null;
          },
        },
      })
      .provide({
        provide: Ability,
        useValue: {
          can: (_type, _resource) => {
            return _resource ? true : undefined;
          },
        },
      });
  });

  beforeEach(() => {
    service = TestBed.inject(ViewService);
    widgetService = TestBed.inject(WidgetService);
    dashboardService = TestBed.inject(DashboardService);
    testDashboard = new Dashboard({ id: 1, user: 1, organization: 1 });
  });
  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should set dashboard", () => {
    const dateSpy = spyOn(service, "datesChanged");
    service.setDashboard(testDashboard, 1);
    expect(dateSpy).toHaveBeenCalled();
  });

  it("should return live", () => {
    expect(service.isLive).toBeUndefined();
    service.setDashboard(testDashboard, 1);
    expect(service.isLive).toBe(true);
  });

  it("should return range", () => {
    expect(service.range).toBeUndefined();
    testDashboard.properties = {
      timeRange: 3,
    };
    service.setDashboard(testDashboard, 1);
    expect(service.range).toEqual(3);
  });

  it("should return start and end dates", () => {
    testDashboard.properties = {
      startTime: "2022-03-01T00:00:00Z",
      endTime: "2022-03-01T01:00:00Z",
    };
    service.setDashboard(testDashboard, 1);

    expect(service.startTime).toBeDefined();
    expect(service.endTime).toBeDefined();
  });

  it("should send out widget id to resize", () => {
    service.resize.pipe(take(1)).subscribe((id) => {
      expect(id).toEqual(1);
    });

    service.resizeWidget(1);
  });

  it("should emit resize to all widgets", () => {
    service.resize.pipe(take(1)).subscribe((id) => {
      expect(id).toBeNull();
    });

    service.resizeAll();
  });

  it("should update given widget", () => {
    const widgetSpy = spyOn(widgetService, "read").and.returnValue(
      of(testWidget)
    );
    service.setDashboard(testDashboard, 1);
    service.setWidgets([testWidget]);
    service.updateWidget(1, testWidget);

    expect(widgetSpy).toHaveBeenCalled();
  });

  it("should add new widget", () => {
    const widgetSpy = spyOn(widgetService, "read").and.returnValue(
      of(testWidget)
    );
    service.setDashboard(testDashboard, 1);
    service.setWidgets([]);
    service.updateWidget(1, testWidget);

    expect(widgetSpy).toHaveBeenCalled();
  });

  it("should delete given widget", () => {
    const widgetSpy = spyOn(widgetService, "delete").and.returnValue(of(true));
    service.setDashboard(testDashboard, 1);
    service.setWidgets([testWidget]);

    service.deleteWidget(testWidget.id);

    expect(widgetSpy).toHaveBeenCalled();
  });

  it("should delete dashboard", () => {
    const dashSpy = spyOn(dashboardService, "delete").and.returnValue(of(true));

    service.deleteDashboard(testDashboard.id);

    expect(dashSpy).toHaveBeenCalled();
  });

  it("should save dashboard", () => {
    service.setDashboard(testDashboard, 1);
    const dashSpy = spyOn(dashboardService, "partialUpdate").and.returnValue(
      of(testDashboard)
    );

    service.saveDashboard();

    expect(dashSpy).toHaveBeenCalled();
  });
});
