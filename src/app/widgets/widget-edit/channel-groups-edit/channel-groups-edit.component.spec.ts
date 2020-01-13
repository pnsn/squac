import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupsEditComponent } from './channel-groups-edit.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChannelGroupsEditComponent', () => {
  let component: ChannelGroupsEditComponent;
  let fixture: ComponentFixture<ChannelGroupsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, HttpClientTestingModule],
      declarations: [ ChannelGroupsEditComponent , LoadingComponent]
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
