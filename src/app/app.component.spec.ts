import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthService } from './auth/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';


describe('AppComponent', () => {
  let fixture;
  let appComponent: AppComponent;
  let authServiceStub: Partial<AuthService>;
  let authService: AuthService;
  beforeEach(async(() => {

    authServiceStub = {

      autologin() {
        return true;
      }
    };

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
        provide: AuthService, useValue: authServiceStub
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    appComponent = fixture.componentInstance;

    authService = TestBed.get(AuthService);
  }));

  it('should create the app', () => {
    expect(appComponent).toBeTruthy();
  });

  it(`should have as title 'squac-ui'`, () => {
    expect(appComponent.title).toEqual('squac-ui');
  });

  // it('should render header component', () => {
  //   const header = TestBed.createComponent(HeaderComponent);
  //   expect(header).toBeTruthy();
  // });

});
