import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupsTableComponent } from './channel-groups-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

describe('ChannelGroupsTableComponent', () => {
  let component: ChannelGroupsTableComponent;
  let fixture: ComponentFixture<ChannelGroupsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxDatatableModule
      ],
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
