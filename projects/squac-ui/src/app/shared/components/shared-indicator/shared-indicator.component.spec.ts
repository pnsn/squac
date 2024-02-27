import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";
import { MockModule } from "ng-mocks";
import { SharedIndicatorComponent } from "./shared-indicator.component";

describe("SharedIndicatorComponent", () => {
  let component: SharedIndicatorComponent;
  let fixture: ComponentFixture<SharedIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockModule(MatIconModule)],
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
