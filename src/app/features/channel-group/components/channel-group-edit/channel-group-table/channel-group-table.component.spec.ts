import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChannelGroupTableComponent } from "./channel-group-table.component";

describe("ChannelGroupTableComponent", () => {
  let component: ChannelGroupTableComponent;
  let fixture: ComponentFixture<ChannelGroupTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChannelGroupTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
