import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { SquacApiService } from "@core/services/squacapi.service";
import { Data } from "@angular/router";
import { environment } from "../../../environments/environment";

describe("SquacApiService", () => {
  let httpTestingController: HttpTestingController;
  let service: SquacApiService;
  const testUrl = "data/";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SquacApiService],
    });

    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(SquacApiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("can get data", () => {
    const testData: Data = { name: "Test Data" };

    // Make an HTTP GET request
    service.get(testUrl).subscribe((data) =>
      // When observable resolves, result should match test data
      expect(data).toEqual(testData)
    );

    const req = httpTestingController.expectOne(
      environment.apiUrl + environment.version + testUrl
    );
    expect(req.request.method).toEqual("GET");

    req.flush(testData);
  });

  it("can post data", () => {
    const testData: Data = { name: "Test Data" };

    service
      .post(testUrl, testData)
      .subscribe((data) => expect(data).toEqual(testData));

    const req = httpTestingController.expectOne(
      environment.apiUrl + environment.version + testUrl
    );

    expect(req.request.method).toEqual("POST");

    req.flush(testData);
  });

  it("can put data", () => {
    const testData: Data = { name: "Test Data", id: 1 };

    service
      .put(testUrl, testData.id, testData)
      .subscribe((data) => expect(data).toEqual(testData));

    const req = httpTestingController.expectOne(
      environment.apiUrl + environment.version + testUrl + testData.id + "/"
    );

    expect(req.request.method).toEqual("PUT");

    req.flush(testData);
  });

  it("can patch data", () => {
    const testData: Data = { name: "Test Data", id: 1 };

    service
      .patch(testUrl, testData.id, testData)
      .subscribe((data) => expect(data).toEqual(testData));

    const req = httpTestingController.expectOne(
      environment.apiUrl + environment.version + testUrl + testData.id + "/"
    );

    expect(req.request.method).toEqual("PATCH");

    req.flush(testData);
  });

  it("can delete data", () => {
    const testData: Data = { name: "Test Data", id: 1 };

    service
      .delete(testUrl, testData.id)
      .subscribe((data) => expect(data).toEqual(testData));

    const req = httpTestingController.expectOne(
      environment.apiUrl + environment.version + testUrl + testData.id + "/"
    );

    expect(req.request.method).toEqual("DELETE");

    req.flush(testData);
  });
});
