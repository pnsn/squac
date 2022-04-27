import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OrganizationDetailComponent } from "./organization-detail.component";
import { ReactiveFormsModule } from "@angular/forms";
import { UserService } from "@user/services/user.service";
import { of } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { InviteService } from "@user/services/invite.service";
import { OrganizationService } from "@user/services/organization.service";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { RouterTestingModule } from "@angular/router/testing";
import { TableViewComponent } from "@shared/components/table-view/table-view.component";
import { MockBuilder } from "ng-mocks";

describe("OrganizationDetailComponent", () => {
  let component: OrganizationDetailComponent;
  let fixture: ComponentFixture<OrganizationDetailComponent>;

  beforeEach(() => {
    return MockBuilder(OrganizationDetailComponent)
      .mock(TableViewComponent)
      .keep(ReactiveFormsModule)
      .mock(NgxDatatableModule)
      .keep(RouterTestingModule.withRoutes([]))
      .mock(OrganizationService)
      .mock(UserService)
      .mock(InviteService)
      .provide({
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
      });
  });

  it("should create", () => {
    fixture = TestBed.createComponent(OrganizationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
