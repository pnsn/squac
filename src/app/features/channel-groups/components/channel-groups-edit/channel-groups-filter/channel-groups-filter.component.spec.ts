import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupsFilterComponent } from './channel-groups-filter.component';
import { MaterialModule } from '@shared/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ChannelGroupsFilterComponent', () => {
  let component: ChannelGroupsFilterComponent;
  let fixture: ComponentFixture<ChannelGroupsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, NoopAnimationsModule],
      declarations: [ ChannelGroupsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
