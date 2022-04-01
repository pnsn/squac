import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '@core/services/auth.service';
import { MockDeclaration, MockedComponentFixture, MockInstance, MockModule, MockProvider, MockProviders, MockRender, MockService, ngMocks } from 'ng-mocks';
import { SharedModule } from '@shared/shared.module';
import { HomeComponent } from '../home/home.component';
import { User } from '@features/user/models/user';
import { AppAbility } from '@core/utils/ability';
import { PureAbility } from '@casl/ability';

describe('HeaderComponent', () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(async () => {
    return TestBed.configureTestingModule({
      imports: [
        MockModule(SharedModule)
      ],
      declarations: [
        HeaderComponent
      ],
      providers: [
        MockProviders(AuthService, AppAbility, PureAbility)
      ]
    }).compileComponents();
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

    component.logout();

    expect(spyLogout).toHaveBeenCalled();
  });
});
