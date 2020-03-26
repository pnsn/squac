import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthService } from './auth/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MockAuthService } from './auth/auth.service.mock';
import { UserService } from './auth/user.service';
import { MockUserService } from './auth/user.service.mock';


describe('AppComponent', () => {
  let fixture;
  let appComponent: AppComponent;
  let userService: UserService;
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatMenuModule,
        MatToolbarModule,
        MatIconModule
      ],
      declarations: [
        AppComponent,
        HeaderComponent
      ],
      providers: [{
        provide: AuthService, useClass: MockAuthService } ,
        { provide: UserService, useClass: MockUserService
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    appComponent = fixture.componentInstance;

    userService = TestBed.inject(UserService);
  }));

  it('should create the app', () => {
    expect(appComponent).toBeTruthy();
  });

  it('should have as title "squac-ui"', () => {
    expect(appComponent.title).toEqual('squac-ui');
  });

  it('should listen to user log in', () => {
    appComponent.ngOnInit();
    expect(appComponent.loggedIn).toEqual(false);
    userService.fetchUser();
    expect(appComponent.loggedIn).toEqual(true);
  });
});
