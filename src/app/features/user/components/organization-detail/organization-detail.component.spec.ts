import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationDetailComponent } from './organization-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/material.module';
import { UserService } from '@features/user/services/user.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { InviteService } from '@features/user/services/invite.service';
import { OrganizationsService } from '@features/user/services/organizations.service';
import { MockUserService } from '@features/user/services/user.service.mock';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

describe('OrganizationDetailComponent', () => {
  let component: OrganizationDetailComponent;
  let fixture: ComponentFixture<OrganizationDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationDetailComponent ],
      imports: [ ReactiveFormsModule , MaterialModule,  NgxDatatableModule,
        HttpClientTestingModule
      ],
      providers: [
        {provide: ActivatedRoute , useValue: {
          snapshot: {
            data: {
              organization: {},

            }
          },
          parent: {
            snapshot: {
              data: {
                user: {isAdmin: false}
              }
            }
          },
          data: of({
            organization: {}
          })
        }},
        InviteService,
        OrganizationsService,
        {
          provide: UserService, useClass: MockUserService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
