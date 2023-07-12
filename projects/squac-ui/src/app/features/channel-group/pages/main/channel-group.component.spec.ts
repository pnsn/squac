import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChannelGroupComponent } from "./channel-group.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ChannelGroupService } from "squacapi";
import { NetworkService } from "squacapi";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

describe("ChannelGroupComponent", () => {
  let component: ChannelGroupComponent;
  let fixture: ComponentFixture<ChannelGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ChannelGroupComponent,
      ],
      providers: [
        ChannelGroupService,
        NetworkService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 123 }),
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ChannelGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
