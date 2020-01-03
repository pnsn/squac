import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Channel } from '../channel';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() channels: Channel[];
  // @Input() editPage: boolean;
  // @Output() boundsChange = new EventEmitter(); // in html (boundsChange)="updateBounds($event)"
  map: L.Map;
  channelLayer: L.LayerGroup;
  mapIcon: L.Icon;
  // boundingBox: L.Rectangle;
  // boxBounds = [];
  // bounds = [];
  // onMapClickBound = this.onMapClick.bind(null, this);
  options: {
    center: L.LatLng,
    zoom: number,
    layers: L.Layer[]
  };
  layers: L.Layer[];
  fitBounds: L.LatLngBounds;

  constructor() { }

  ngOnInit() {
    this.initMap();
  }

  ngOnChanges() {
    this.updateMap();
  }

  initMap(): void {
    this.channelLayer = L.layerGroup([]);
    this.mapIcon = L.icon({
      iconUrl: '../../assets/map-marker.png',
      shadowUrl: '',
      iconSize:     [32, 32], // size of the icon
      shadowSize:   [0, 0], // size of the shadow
      iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
      shadowAnchor: [0, 0],  // the same for the shadow
      popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });
    this.layers = [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }),
      this.channelLayer
    ];
    this.options = {
      center: L.latLng(45.0000, -120.0000),
      zoom: 5,
      layers: this.layers
    };
    this.options.layers.push(L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }));
  }

  updateMap() {
    if (this.channelLayer) {
      this.layers.pop();
      let sumLat = 0; // Sums used for recentering
      let sumLon = 0;
      const chanLatLng = [];
      const chanMarkers = this.channels.map((channel) => {
        sumLat += channel.lat;
        sumLon += channel.lon;
        chanLatLng.push([channel.lat, channel.lon]);
        return L.marker([channel.lat, channel.lon], {icon: this.mapIcon}).bindPopup(channel.stationCode.toUpperCase());
      });
      this.channelLayer = L.layerGroup(chanMarkers);
      this.layers.push(this.channelLayer);
      this.options.center = L.latLng(sumLat / chanMarkers.length, sumLon / chanMarkers.length);
      this.fitBounds = L.latLngBounds(chanLatLng);
    }
  }
  /* Old bounding box code - to be deleted if ngx leaflet works
  onAddBoundingBox() {
    document.getElementById('map').style.cursor = "crosshair";
    document.getElementById('map').addEventListener("click", this.onMapClickBound);
  }

  onCancelBoundingBox() {
    document.getElementById('map').style.cursor = "grab";
    document.getElementById('map').removeEventListener("click", this.onMapClickBound);
    this.boundsChanged(false);
    if (this.boundingBox) {
      this.map.removeLayer(this.boundingBox);
    }
  }

  onMapClick(mapComp, e) {
    mapComp.boxBounds.push(mapComp.map.mouseEventToLatLng(e));
    if (mapComp.boxBounds.length === 2) {
      mapComp.boundingBox = new L.Rectangle(mapComp.boxBounds, {color: "#ffb34d", weight: 0.5});
      mapComp.boundingBox.editing.enable();
      mapComp.boundsChanged(true);
      mapComp.boxBounds = [];
      mapComp.map.addLayer(mapComp.boundingBox);
      console.log(mapComp.boundingBox)
    } else {
      if (mapComp.boundingBox) {
        mapComp.map.removeLayer(mapComp.boundingBox);
        mapComp.boundsChanged(false);
      }
    }
  }

  boundsChanged(completed: boolean) {
    if (completed) {
      let latlng = `${this.boxBounds[0].lat} ${this.boxBounds[0].lng} ${this.boxBounds[1].lat} ${this.boxBounds[1].lng}`
      this.boundsChange.emit(latlng);
    } else {
      this.boundsChange.emit("");
    }
  }*/
}
