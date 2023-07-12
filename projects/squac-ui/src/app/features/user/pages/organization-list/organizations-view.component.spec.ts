import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { OrganizationService } from "squacapi";
import { MockBuilder } from "ng-mocks";
import { of } from "rxjs";

import { OrganizationsViewComponent } from "./organizations-view.component";
import { DetailPageComponent } from "@shared/components/detail-page/detail-page.component";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";

describe("OrganizationsViewComponent", () => {
  let component: OrganizationsViewComponent;
  let fixture: ComponentFixture<OrganizationsViewComponent>;

  beforeEach(() => {
    return MockBuilder(OrganizationsViewComponent, [
      MatCardModule,
      MatListModule,
      RouterTestingModule.withRoutes([]),
      OrganizationService,
      DetailPageComponent,
    ]).provide({
      provide: ActivatedRoute,
      useValue: {
        params: of(),
        data: of(),
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
