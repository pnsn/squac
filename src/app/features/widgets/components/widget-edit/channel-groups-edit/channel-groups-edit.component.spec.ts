import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupsEditComponent } from './channel-groups-edit.component';
import { MaterialModule } from '@shared/material.module';
import { LoadingComponent } from '@shared/loading/loading.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WidgetEditService } from '@features/widgets/services/widget-edit.service';
import { MockWidgetEditService } from '@features/widgets/services/widget-edit.service.mock';
import { ChannelGroupsService } from '@features/channel-groups/services/channel-groups.service';
import { MockChannelGroupsService } from '@features/channel-groups/services/channel-groups.service.mock';

describe('ChannelGroupsEditComponent', () => {
  let component: ChannelGroupsEditComponent;
  let fixture: ComponentFixture<ChannelGroupsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, HttpClientTestingModule],
      declarations: [ ChannelGroupsEditComponent , LoadingComponent],
      providers: [
        {provide: WidgetEditService, useClass: MockWidgetEditService},
        {provide: ChannelGroupsService, useClass: MockChannelGroupsService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
