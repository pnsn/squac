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
  mapIcon: L.Icon;

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
    this.mapIcon = L.icon({
      iconUrl: '../../assets/blue_icon.png',
      shadowUrl: '../../assets/blue_icon.png',
      iconSize:     [20, 20], // size of the icon
      shadowSize:   [0, 0], // size of the shadow
      iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 0],  // the same for the shadow
      popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });
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
      let sumLat = 0; // Sums used for recentering
      let sumLon = 0;
      const chanLatLng = [];
      const chanMarkers = this.selectedChannels.map((channel) => {
        sumLat += channel.lat;
        sumLon += channel.lon;
        chanLatLng.push([channel.lat, channel.lon]);
        return L.marker([channel.lat, channel.lon], {icon: this.mapIcon}).bindPopup(channel.stationCode.toUpperCase());
      });
      this.channelLayer = L.layerGroup(chanMarkers);
      this.map.addLayer(this.channelLayer);
      this.map.panTo(new L.LatLng(sumLat / chanMarkers.length, sumLon / chanMarkers.length)); // Use average lat lon to recenter
      this.map.fitBounds(L.latLngBounds(chanLatLng)); // Find needed zoom level
    }
  }

}
