import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HeaderComponent } from '../header/header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockInstance, MockModule, MockProvider, MockRender, ngMocks } from 'ng-mocks';
import { MaterialModule } from '@shared/material.module';
import { MessageService } from '@core/services/message.service';

describe('HomeComponent', () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(async () => {
    return TestBed.configureTestingModule({
      imports: [RouterTestingModule, MockModule(MaterialModule)],
      declarations: [HomeComponent, MockComponent(HeaderComponent)],
      providers: [MockProvider(MessageService)]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = MockRender(HomeComponent);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });
});
