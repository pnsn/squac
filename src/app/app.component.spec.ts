import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './core/components/header/header.component';
import { AuthService } from './core/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MockAuthService } from './core/services/auth.service.mock';
import { UserService } from './features/user/services/user.service';
import { MockUserService } from './features/user/services/user.service.mock';
import { LoadingScreenComponent } from '@core/components/loading-screen/loading-screen.component';
import { ConfigurationService } from '@core/services/configuration.service';


describe('AppComponent', () => {
  let fixture;
  let appComponent: AppComponent;
  beforeEach(waitForAsync(() => {

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
        LoadingScreenComponent
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        ConfigurationService

      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    appComponent = fixture.componentInstance;
  }));

  it('should create the app', () => {
    expect(appComponent).toBeTruthy();
  });

  it('should have as title "SQUAC"', () => {
    expect(appComponent.title).toEqual('SQUAC');
  });

});
