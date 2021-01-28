import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SquacApiService } from '../../services/squacapi.service';
import { MockSquacApiService } from '../../services/squacapi.service.mock';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Ability, PureAbility } from '@casl/ability';
import { AbilityModule } from '@casl/angular';
import { AppAbility } from '../../utils/ability';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MessageService } from '@core/services/message.service';
import { AuthService } from '@core/services/auth.service';
import { MockAuthService } from '@core/services/auth.service.mock';
import { UserService } from '@features/user/services/user.service';
import { MockUserService } from '@features/user/services/user.service.mock';
import { throwError } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;
  let userService: UserService;
  let messageService: MessageService;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatToolbarModule,
        AbilityModule,
        MatSnackBarModule
      ],
      providers: [
        MessageService,
        { provide: SquacApiService, useValue: MockSquacApiService },
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: AuthService, useValue: new MockAuthService()},
        { provide: PureAbility , useExisting: Ability },
        { provide: UserService, useValue: new MockUserService()}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);
    userService = TestBed.inject(UserService);
    messageService = TestBed.inject(MessageService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout', () => {
    const authSpy = spyOn(authService, 'logout');
    component.logout();
    expect(authSpy).toHaveBeenCalled();
  });
});
