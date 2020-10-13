import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationComponent } from './organization.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/material.module';
import { UserService } from '@features/user/services/user.service';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { InviteService } from '@features/user/services/invite.service';
import { OrganizationsService } from '@features/user/services/organizations.service';
import { MockUserService } from '@features/user/services/user.service.mock';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

describe('OrganizationComponent', () => {
  let component: OrganizationComponent;
  let fixture: ComponentFixture<OrganizationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationComponent ],
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
          }
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
    fixture = TestBed.createComponent(OrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
