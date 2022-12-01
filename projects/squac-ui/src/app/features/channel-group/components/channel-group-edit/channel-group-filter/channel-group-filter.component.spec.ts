import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChannelGroupFilterComponent } from "./channel-group-filter.component";
import { MaterialModule } from "@shared/material.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";

describe("ChannelGroupFilterComponent", () => {
  let component: ChannelGroupFilterComponent;
  let fixture: ComponentFixture<ChannelGroupFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        FormsModule,
      ],
      declarations: [ChannelGroupFilterComponent],
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
