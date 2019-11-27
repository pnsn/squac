import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupsFilteringComponent } from './channel-groups-filtering.component';

describe('ChannelGroupsFilteringComponent', () => {
  let component: ChannelGroupsFilteringComponent;
  let fixture: ComponentFixture<ChannelGroupsFilteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelGroupsFilteringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupsFilteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
