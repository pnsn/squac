import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { OrganizationDetailComponent } from "./organization-detail.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "@shared/material.module";
import { UserService } from "@user/services/user.service";
import { of } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { InviteService } from "@user/services/invite.service";
import { OrganizationService } from "@user/services/organization.service";
import { MockUserService } from "@user/services/user.service.mock";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { RouterTestingModule } from "@angular/router/testing";
import { TableViewComponent } from "@shared/components/table-view/table-view.component";
import { MockComponent } from "ng-mocks";

describe("OrganizationDetailComponent", () => {
  let component: OrganizationDetailComponent;
  let fixture: ComponentFixture<OrganizationDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrganizationDetailComponent,
        MockComponent(TableViewComponent),
      ],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        NgxDatatableModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                organization: {},
              },
            },
            parent: {
              snapshot: {
                data: {
                  user: { isAdmin: false },
                },
              },
            },
            data: of({
              organization: {},
            }),
          },
        },
        InviteService,
        OrganizationService,
        {
          provide: UserService,
          useClass: MockUserService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
