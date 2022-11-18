import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { UserEditComponent } from "./user-edit.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../projects/squac-ui/src/app/shared/material.module";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ErrorComponent } from "../projects/squac-ui/src/app/shared/components/error/error.component";

describe("UserEditComponent", () => {
  let component: UserEditComponent;
  let fixture: ComponentFixture<UserEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserEditComponent, ErrorComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterTestingModule.withRoutes([
          { path: "login", component: UserEditComponent },
        ]),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
