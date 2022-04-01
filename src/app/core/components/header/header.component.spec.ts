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
import { BehaviorSubject, throwError } from 'rxjs';
import { MockInstance, MockModule, MockProvider, MockProviders, MockRender, MockService, ngMocks } from 'ng-mocks';
import { SharedModule } from '@shared/shared.module';
import { User } from '@features/user/models/user';

describe('HeaderComponent', () => {
  let user : BehaviorSubject<any> = new BehaviorSubject<any>(null);
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(async () => {
    return TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MockModule(SharedModule)
      ],
      declarations: [
        HeaderComponent,
      ],
      providers: [
        MockProviders(MessageService, AuthService, PureAbility, AppAbility, UserService)
      ]
    }).compileComponents();
  });

  beforeEach(()=>{
    MockInstance(UserService, instance =>
      ngMocks.stub(instance, {
        user,
      })
    )
  });

  afterAll(() => {
    user.complete();
  });

  it('should create', () => {
    const fixture = MockRender(HeaderComponent);
    expect(
      fixture.point.componentInstance,
    ).toEqual(jasmine.any(HeaderComponent));
  });

  it('should logout', () => {
    const spyLogout = MockInstance(
      AuthService,
      'logout',
      jasmine.createSpy("logoutSpy")
    );

    const fixture = MockRender(HeaderComponent);
    const component = fixture.point.componentInstance;

    fixture.detectChanges();
    user.next(MockService(User));


    component.logout();

    expect(spyLogout).toHaveBeenCalled();
  });
});
