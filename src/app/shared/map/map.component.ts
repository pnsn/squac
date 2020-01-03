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
  @Input() editPage: boolean;
  @Output() boundsChange = new EventEmitter(); // in html (boundsChange)="updateBounds($event)"
  map: L.Map;
  channelLayer: L.LayerGroup;
  drawnItems: L.FeatureGroup;
  mapIcon: L.Icon;
  options: {
    center: L.LatLng,
    zoom: number,
    layers: L.Layer[]
  };
  drawOptions: { };
  layers: L.Layer[];
  fitBounds: L.LatLngBounds;
  rectLayer: any;

  constructor() { }

  ngOnInit() {
    this.initMap();
  }

  ngOnChanges() {
    this.updateMap();
  }

  initMap(): void {
    this.channelLayer = L.layerGroup([]);
    this.drawnItems = new L.FeatureGroup();
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
      this.drawnItems,
      this.channelLayer
    ];
    this.options = {
      center: L.latLng(45.0000, -120.0000),
      zoom: 5,
      layers: this.layers
    };
    this.drawOptions = {
      position: 'topright',
      draw: {
       polygon: false,
       polyline: false,
       rectangle: {
         showArea: false // disable showArea
       },
       circle: false,
       circlemarker: false,
       marker: false,
      },
      edit: { featureGroup: this.drawnItems }
   };
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
      if (chanMarkers.length > 0) {
        this.options.center = L.latLng(sumLat / chanMarkers.length, sumLon / chanMarkers.length);
        this.fitBounds = L.latLngBounds(chanLatLng);
      }
    }
  }

  onDrawStart() {
    this.drawnItems.clearLayers();
    this.boundsChange.emit('');
  }

  onRectangleCreated(e: any) {
    this.rectLayer = e.layer;
    this.boundsChange.emit(''); // Clear old bounds
    const rectangleNE = this.rectLayer._bounds._northEast; // Northeast corner lat lng
    const rectangleSW = this.rectLayer._bounds._southWest; // Southwest corner lat lng
    const latLngBounds = `${rectangleNE.lat} ${rectangleSW.lng} ${rectangleSW.lat} ${rectangleNE.lng}`;
    // Convert SE and NE to upper left and NE and SW coordinates
    this.boundsChange.emit(latLngBounds);
  }

  onRectangleEdited() {
    this.boundsChange.emit(''); // Clear old bounds
    const rectangleNE = this.rectLayer._bounds._northEast; // Northeast corner lat lng
    const rectangleSW = this.rectLayer._bounds._southWest; // Southwest corner lat lng
    const latLngBounds = `${rectangleNE.lat} ${rectangleSW.lng} ${rectangleSW.lat} ${rectangleNE.lng}`;
    // Convert SE and NE to upper left and NE and SW coordinates
    this.boundsChange.emit(latLngBounds);
  }

  onRectangleDeleted() {
    this.boundsChange.emit(''); // Clear old bounds
  }
}
