import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SharedModule } from "../projects/squac-ui/src/app/shared/shared.module";
import { MockModule } from "ng-mocks";

import { SharedIndicatorComponent } from "./shared-indicator.component";

describe("SharedIndicatorComponent", () => {
  let component: SharedIndicatorComponent;
  let fixture: ComponentFixture<SharedIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MockModule(MatTooltipModule),
        MockModule(MatIconModule),
        MockModule(SharedModule),
      ],
      declarations: [SharedIndicatorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  afterEach(() => {
    fixture.destroy();
  });
});
