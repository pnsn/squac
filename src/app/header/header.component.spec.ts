import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SquacApiService } from '../squacapi.service';
import { MockSquacApiService } from '../squacapi.service.mock';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Ability } from '@casl/ability';
import { AbilityModule } from '@casl/angular';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule, 
        MatToolbarModule,
        AbilityModule
      ],
      providers: [
        { provide: SquacApiService, useValue: MockSquacApiService },
        {provide: Ability, useValue: new Ability()}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
