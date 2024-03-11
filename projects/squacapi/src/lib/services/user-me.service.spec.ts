import { HttpClientModule } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { ApiModule, ApiService, BASE_PATH } from "@pnsn/ngx-squacapi-client";
import { MockBuilder } from "ng-mocks";

import { UserMeService } from "./user-me.service";

describe("UserMeService", () => {
  beforeEach(() => {
    return MockBuilder(
      [UserMeService, ApiService, HttpClientModule],
      [ApiModule, BASE_PATH]
    )
      .replace(HttpClientModule, HttpClientTestingModule)
      .mock(BASE_PATH, "");
  });
  it("should be created", () => {
    const service = TestBed.inject(UserMeService);
    expect(service).toBeDefined();
  });

  it("should call read for no params", () => {
    const service = TestBed.inject(UserMeService);
    const httpMock = TestBed.inject(HttpTestingController);

    service.read().subscribe((res: any) => {
      expect(res.name).toBe("test");
    });

    const req = httpMock.expectOne("/api/user/me/");
    req.flush({ name: "test" });
    httpMock.verify();
  });

  it("should return partial update params", () => {
    const service = TestBed.inject(UserMeService);
    const params = service._partialUpdateParams(
      { firstname: "firstname", lastname: "lastname", email: "email" },
      ["firstname"]
    );
    expect(params.data).toEqual({
      firstname: "firstname",
      lastname: "lastname",
    });
  });
});
