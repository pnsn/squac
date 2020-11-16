import { compileNgModule } from '@angular/compiler';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Widget } from '@features/widgets/models/widget';

import { MapComponent } from './map.component';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
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
