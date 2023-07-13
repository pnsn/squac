import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { DashboardComponent } from "./dashboard.component";
import { DashboardService } from "squacapi";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { DashboardViewComponent } from "@dashboard/pages/list/dashboard-view.component";
import { RouterTestingModule } from "@angular/router/testing";
import { Ability, PureAbility } from "@casl/ability";
import { AbilityModule } from "@casl/angular";
import { AppAbility } from "@core/utils/ability";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MockBuilder } from "ng-mocks";

describe("DashboardComponent", () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(() => {
    return MockBuilder(DashboardComponent);
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
