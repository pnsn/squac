import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupsFilterComponent } from './channel-groups-filter.component';
import { MaterialModule } from 'src/app/shared/material.module';

describe('ChannelGroupsFilterComponent', () => {
  let component: ChannelGroupsFilterComponent;
  let fixture: ComponentFixture<ChannelGroupsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
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
