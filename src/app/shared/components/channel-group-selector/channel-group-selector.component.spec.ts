import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupSelectorComponent } from './channel-group-selector.component';

describe('ChannelGroupSelectorComponent', () => {
  let component: ChannelGroupSelectorComponent;
  let fixture: ComponentFixture<ChannelGroupSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelGroupSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
