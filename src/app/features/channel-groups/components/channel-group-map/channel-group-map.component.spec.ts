import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelGroupMapComponent } from './channel-group-map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';

describe('MapComponent', () => {
  let component: ChannelGroupMapComponent;
  let fixture: ComponentFixture<ChannelGroupMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        LeafletModule,
        LeafletDrawModule
      ],
      declarations: [ ChannelGroupMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelGroupMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
