import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Channel } from '../channel';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() public selectedChannels: Channel[];
  map: L;
  channelLayer: L.LayerGroup;

  constructor() { }

  ngOnInit() {
    this.initMap();
    console.log(this.selectedChannels);
  }

  ngOnChanges() {
    this.updateMap();
  }

  initMap(): void {
    this.channelLayer = L.layerGroup([]);
    this.map = L.map('map', {
      center: [45.0000, -120.0000],
      zoom: 5,
      layers: this.channelLayer,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

  updateMap() {
    if (this.channelLayer) {
      this.map.removeLayer(this.channelLayer);
      const chanMarkers = this.selectedChannels.map((channel) => {
        return L.marker([channel.lat, channel.lon]).bindPopup(channel.stationCode);
      });
      this.channelLayer = L.layerGroup(chanMarkers);
      this.map.addLayer(this.channelLayer);
    }
  }

}
