import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { OrganizationService } from "squacapi";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";

import { OrganizationsViewComponent } from "./organizations-view.component";

describe("OrganizationsViewComponent", () => {
  let component: OrganizationsViewComponent;
  let fixture: ComponentFixture<OrganizationsViewComponent>;

  beforeEach(() => {
    return MockBuilder(OrganizationsViewComponent)
      .mock(RouterTestingModule.withRoutes([]))
      .mock(OrganizationService)
      .provide({
        provide: ActivatedRoute,
        useValue: {
          params: of(),
        },
      });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
