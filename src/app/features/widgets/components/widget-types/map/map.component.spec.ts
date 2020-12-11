import { compileNgModule } from '@angular/compiler';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { Widget } from '@features/widgets/models/widget';

import { MapComponent } from './map.component';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ LeafletModule, LeafletDrawModule ],
      declarations: [ MapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.widget = new Widget(
      1, 1, 'name', 'description', 1, 1, 1, 0, 0, 1, 1, []
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
