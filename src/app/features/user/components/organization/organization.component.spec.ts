import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationComponent } from './organization.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/material.module';
import { UserService } from '@features/user/services/user.service';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { InviteService } from '@features/user/services/invite.service';
import { OrganizationsService } from '@features/user/services/organizations.service';

describe('OrganizationComponent', () => {
  let component: OrganizationComponent;
  let fixture: ComponentFixture<OrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationComponent ],
      imports: [ ReactiveFormsModule , MaterialModule,
        HttpClientTestingModule
      ],
      providers: [
        {provide: ActivatedRoute , useValue: {
          snapshot: {
            data: {
              organization: {},
              user: {isAdmin: false}
            }
          }
        }},
        InviteService,
        OrganizationsService,
        UserService
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
