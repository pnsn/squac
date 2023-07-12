import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { ChannelGroupFilterComponent } from "./channel-group-filter.component";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe("ChannelGroupFilterComponent", () => {
  let component: ChannelGroupFilterComponent;
  let fixture: ComponentFixture<ChannelGroupFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ChannelGroupFilterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
