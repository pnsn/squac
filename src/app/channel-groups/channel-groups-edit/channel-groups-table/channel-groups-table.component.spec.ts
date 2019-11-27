import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupsTableComponent } from './channel-groups-table.component';

describe('ChannelGroupsTableComponent', () => {
  let component: ChannelGroupsTableComponent;
  let fixture: ComponentFixture<ChannelGroupsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelGroupsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
