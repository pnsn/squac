import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { UserComponent } from "./user.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { UserService } from "@features/user/services/user.service";
import { AbilityModule } from "@casl/angular";
import { Ability, PureAbility } from "@casl/ability";
import { AppAbility } from "@core/utils/ability";
import { RouterTestingModule } from "@angular/router/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { MessageService } from "@core/services/message.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("UserComponent", () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        AbilityModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 123 }),
            snapshot: {
              data: {
                organization: {},
              },
            },
          },
        },
        UserService,
        MessageService,
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility, useExisting: Ability },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
