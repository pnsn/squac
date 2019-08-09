import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupsViewComponent } from './channel-groups-view.component';

describe('ChannelGroupsViewComponent', () => {
  let component: ChannelGroupsViewComponent;
  let fixture: ComponentFixture<ChannelGroupsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelGroupsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
