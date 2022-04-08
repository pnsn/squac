import { TestBed } from '@angular/core/testing';
import { AuthComponent } from './auth.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockInstance, MockRender, ngMocks } from 'ng-mocks';

describe('AuthComponent', () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(async () => {
    return TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AuthComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = MockRender(AuthComponent);
    
    expect(
      fixture.point.componentInstance,
    ).toEqual(jasmine.any(AuthComponent));
  });
});
