import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupsCreateComponent } from './channel-groups-create.component';

describe('ChannelGroupsCreateComponent', () => {
  let component: ChannelGroupsCreateComponent;
  let fixture: ComponentFixture<ChannelGroupsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelGroupsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
