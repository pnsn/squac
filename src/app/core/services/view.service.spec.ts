import { TestBed } from "@angular/core/testing";

import { ViewService } from "./view.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DashboardService } from "@dashboard/services/dashboard.service";
import { MockDashboardService } from "@dashboard/services/dashboard.service.mock";
import { MockWidgetService } from "@widget/services/widget.service.mock";
import { WidgetService } from "@widget/services/widget.service";
import { AbilityModule } from "@casl/angular";
import { Ability } from "@casl/ability";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { Widget } from "@widget/models/widget";
import { Dashboard } from "@dashboard/models/dashboard";
import { take } from "rxjs/operators";
import * as dayjs from "dayjs";
import { MessageService } from "./message.service";
import { of } from "rxjs";
import { DateService } from "./date.service";
import { MockDateService } from "./date.service.mock";

describe("ViewService", () => {
  let service: ViewService;
  let widgetService;
  let dashboardService;
  const abilityMock = {
    can: (_permission, resource) => {
      return resource && resource.owner && resource.owner === 1;
    },
  };
  const testWidget = new Widget(
    1,
    1,
    "name",
    "description",
    1,
    1,
    2,
    1,
    1,
    1,
    1,
    []
  );
  let testDashboard;
  // const mockSquacApiService = new MockSquacApiService( testMetric );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AbilityModule, MatSnackBarModule],
      providers: [
        {
          provide: DashboardService,
          useClass: MockDashboardService,
        },
        {
          provide: WidgetService,
          useClass: MockWidgetService,
        },
        { provide: Ability, useValue: abilityMock },
        {
          provide: MessageService,
          useValue: {
            message: (_text) => {
              return;
            },
            error: (_text) => {
              return;
            },
          },
        },
        {
          provide: DateService,
          useValue: new MockDateService(),
        },
      ],
    });
    service = TestBed.inject(ViewService);
    widgetService = TestBed.inject(WidgetService);
    dashboardService = TestBed.inject(DashboardService);
    testDashboard = new Dashboard(
      1,
      1,
      "name",
      "description",
      false,
      false,
      1,
      [1]
    );
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
    service.setDashboard(testDashboard);
    expect(service.range).toEqual(3);
  });

  it("should return start date", () => {
    service.setDashboard(testDashboard);
    expect(service.startdate).toBeDefined();
  });

  it("should return enddate", () => {
    service.setDashboard(testDashboard);
    expect(service.enddate).toBeDefined();
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
    service.widgetFinishedLoading();
    service.status.pipe(take(1)).subscribe((status) => {
      expect(status).toEqual("finished");
    });
  });

  it("should start loading", () => {
    service.queuedWidgets = 0;
    service.widgetStartedLoading();
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
