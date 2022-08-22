import { TestBed } from "@angular/core/testing";

import { ViewService } from "./view.service";
import { DashboardService } from "@dashboard/services/dashboard.service";
import { WidgetService } from "@widget/services/widget.service";
import { Ability } from "@casl/ability";
import { Widget } from "@widget/models/widget";
import { Dashboard } from "@dashboard/models/dashboard";
import { take } from "rxjs/operators";
import { MessageService } from "./message.service";
import { of } from "rxjs";
import { DateService } from "./date.service";
import { MockBuilder } from "ng-mocks";
import { AppModule } from "app/app.module";
import * as dayjs from "dayjs";

describe("ViewService", () => {
  let service: ViewService;
  let widgetService;
  let dashboardService;
  const testWidget = new Widget(1, 1, "name", 1, [], "", "");
  let testDashboard;
  // const mockSquacApiService = new MockSquacApiService( testMetric );

  beforeEach(() => {
    return MockBuilder(ViewService, AppModule)
      .mock(WidgetService)
      .mock(DashboardService)
      .mock(MessageService)
      .provide({
        provide: DateService,
        useValue: {
          parseUtc: (date) => {
            return dayjs.utc(date).clone();
          },
          subtractFromNow: (amount: number, unit: string) => {
            return dayjs().subtract(amount, unit);
          },
          // format date
          format: (date: dayjs.Dayjs) => {
            return date.format();
          },
          now: () => {
            return dayjs();
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
    testDashboard = new Dashboard(1, 1, "name", "description", false, false, 1);
  });
  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should set dashboard", () => {
    const dateSpy = spyOn(service, "datesChanged");
    service.setDashboard(testDashboard);
    expect(dateSpy).toHaveBeenCalled();
  });

  it("should return update ability", () => {
    expect(service.canUpdate).toBeUndefined();
    service.setDashboard(testDashboard);
    expect(service.canUpdate).toBe(true);
  });

  it("should return live", () => {
    expect(service.isLive).toBeUndefined();
    service.setDashboard(testDashboard);
    expect(service.isLive).toBe(true);
  });

  it("should return range", () => {
    expect(service.range).toBeUndefined();
    testDashboard.properties = {
      timeRange: 3,
    };
    service.setDashboard(testDashboard);
    expect(service.range).toEqual(3);
  });

  it("should return start and end dates", () => {
    testDashboard.properties = {
      startTime: "2022-03-01T00:00:00Z",
      endTime: "2022-03-01T01:00:00Z",
    };
    service.setDashboard(testDashboard);

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

  it("should stop loading", () => {
    service.queuedWidgets = 1;
    service.finishedLoading();
    service.status.pipe(take(1)).subscribe((status) => {
      expect(status).toEqual("finished");
    });
  });

  it("should start loading", () => {
    service.queuedWidgets = 0;
    service.startedLoading();
    service.status.pipe(take(1)).subscribe((status) => {
      expect(status).toEqual("loading");
    });
  });

  it("should update given widget", () => {
    const widgetSpy = spyOn(widgetService, "getWidget").and.returnValue(
      of(testWidget)
    );
    service.setDashboard(testDashboard);
    service.setWidgets([testWidget]);
    service.updateWidget(1, testWidget);

    expect(widgetSpy).toHaveBeenCalled();
  });

  it("should add new widget", () => {
    const widgetSpy = spyOn(widgetService, "getWidget").and.returnValue(
      of(testWidget)
    );
    service.setDashboard(testDashboard);
    service.setWidgets([]);
    service.updateWidget(1, testWidget);

    expect(widgetSpy).toHaveBeenCalled();
  });

  it("should delete given widget", () => {
    const widgetSpy = spyOn(widgetService, "deleteWidget").and.returnValue(
      of(true)
    );
    service.setDashboard(testDashboard);
    service.setWidgets([testWidget]);

    service.deleteWidget(testWidget.id);

    expect(widgetSpy).toHaveBeenCalled();
  });

  it("should delete dashboard", () => {
    const dashSpy = spyOn(dashboardService, "deleteDashboard").and.returnValue(
      of(true)
    );

    service.deleteDashboard(testDashboard.id);

    expect(dashSpy).toHaveBeenCalled();
  });

  it("should save dashboard", () => {
    service.setDashboard(testDashboard);
    const dashSpy = spyOn(dashboardService, "updateDashboard").and.returnValue(
      of(testDashboard)
    );

    service.saveDashboard();

    expect(dashSpy).toHaveBeenCalled();
  });
});
