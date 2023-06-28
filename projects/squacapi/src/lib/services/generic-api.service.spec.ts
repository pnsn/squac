import { TestBed } from "@angular/core/testing";
import {
  ApiModule,
  ApiService,
  BASE_PATH,
  DashboardWidgetsListRequestParams,
  ReadOnlyWidgetSerializer,
} from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";
import { Observable } from "rxjs";
import { PartialUpdateService, SquacApiService } from "../interfaces";
import { BaseWriteableApiService } from "./generic-api.service";
import { ApiEndpoint } from "../enums";
import { Injectable } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { Widget } from "../models";
import { REFRESH_REQUEST } from "../constants";

/** Test service for checking functions */
@Injectable({ providedIn: "root" })
class TestService extends BaseWriteableApiService<Widget> {
  constructor(override api: ApiService) {
    super(ApiEndpoint.WIDGET, api);
  }
}
interface TestService
  extends SquacApiService<Widget>,
    PartialUpdateService<Widget> {
  read(id: number, refresh?: boolean): Observable<Widget>;
  list(
    params?: DashboardWidgetsListRequestParams,
    refresh?: boolean
  ): Observable<Widget[]>;
  updateOrCreate(t: Widget): Observable<number>;
  delete(id: number): Observable<any>;
  updateOrDelete(t: Widget[], ids: number[]): Observable<number>[];
  partialUpdate(
    t: Partial<Widget>,
    keys: string[],
    mapId?: boolean
  ): Observable<number | Widget>;
}

describe("Generic Api Service", () => {
  let service: TestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    return MockBuilder(
      [TestService, ApiService, HttpClientModule],
      [ApiModule, BASE_PATH]
    )
      .replace(HttpClientModule, HttpClientTestingModule)
      .mock(BASE_PATH, "");
  });

  beforeEach(() => {
    service = TestBed.inject(TestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeDefined();
  });

  it("should be able to delete", () => {
    service.delete(1).subscribe();
    const req = httpMock.expectOne("/api/dashboard/widgets/1/");
    expect(req.request.method).toBe("DELETE");
    req.flush({});
    httpMock.verify();
  });

  it("should be able to request list", () => {
    service.list().subscribe();
    const req = httpMock.expectOne("/api/dashboard/widgets/");
    expect(req.request.method).toBe("GET");
    req.flush([]);
    httpMock.verify();

    // get fresh list
    service.list({}, true).subscribe();
    const req2 = httpMock.expectOne("/api/dashboard/widgets/");
    expect(req2.request.method).toBe("GET");
    expect(req2.request.context.get(REFRESH_REQUEST)).toBe(true);
    req2.flush([]);
    httpMock.verify();
  });

  it("should be able to update or create object", () => {
    const testData: ReadOnlyWidgetSerializer = {
      name: "test widget",
      dashboard: 1,
      metrics: [2, 3],
    };

    const testModel = new Widget(testData);
    //post request
    service.updateOrCreate(testModel).subscribe();
    const req1 = httpMock.expectOne("/api/dashboard/widgets/");
    expect(req1.request.method).toBe("POST");
    req1.flush({});
    httpMock.verify();

    //if model has id, update
    testModel.id = 3;
    service.updateOrCreate(testModel).subscribe();
    const req = httpMock.expectOne("/api/dashboard/widgets/3/");
    expect(req.request.method).toBe("PUT");
    req.flush({ id: 3 });
    httpMock.verify();
  });

  it("should be able to read", () => {
    service.read(1).subscribe();
    const req = httpMock.expectOne("/api/dashboard/widgets/1/");
    expect(req.request.method).toBe("GET");
    req.flush({});
    httpMock.verify();
  });

  it("should be able to partial update", () => {
    const widget = new Widget({ id: 1, metrics: [], dashboard: 2, name: "" });
    // with keys specified
    service.partialUpdate(widget, ["metrics"]).subscribe();

    const req = httpMock.expectOne("/api/dashboard/widgets/1/");
    expect(req.request.method).toBe("PATCH");
    req.flush({});
    httpMock.verify();

    //without Keys
    service.partialUpdate(widget, []).subscribe();

    const req2 = httpMock.expectOne("/api/dashboard/widgets/1/");
    expect(req2.request.method).toBe("PATCH");
    req2.flush({});

    httpMock.verify();
  });

  it("should be able to update or delete", () => {
    const widget = new Widget({ id: 1, metrics: [], dashboard: 2, name: "" });
    const updateWidgets = [widget];
    const deleteIds = [1, 2];

    const requests = service.updateOrDelete(updateWidgets, deleteIds);
    expect(requests.length).toBe(updateWidgets.length + deleteIds.length);
  });
});
