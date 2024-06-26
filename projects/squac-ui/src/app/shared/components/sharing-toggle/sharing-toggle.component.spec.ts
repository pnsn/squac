import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MockBuilder } from "ng-mocks";
import { OrganizationPipe, UserPipe } from "squacapi";

import { SharingToggleComponent } from "./sharing-toggle.component";

describe("SharingToggleComponent", () => {
  let component: SharingToggleComponent;
  let fixture: ComponentFixture<SharingToggleComponent>;
  beforeEach(() => {
    return MockBuilder(SharingToggleComponent)
      .mock(MatButtonToggleModule)
      .mock(OrganizationPipe)
      .mock(UserPipe);
  });
  it("should create", () => {
    fixture = TestBed.createComponent(SharingToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
