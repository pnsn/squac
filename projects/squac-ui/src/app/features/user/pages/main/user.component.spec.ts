import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UserComponent } from "./user.component";
import { MockBuilder } from "ng-mocks";

describe("UserComponent", () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(() => {
    return MockBuilder(UserComponent);
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
