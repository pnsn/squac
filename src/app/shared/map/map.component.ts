import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Channel } from '../channel';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() originalSelectedChannels: Channel[];
  @Input() selectedChannels: Channel[];
  @Input() searchChannels: Channel[];
  @Input() removeChannels: Channel[];
  @Input() isRemoving: boolean;
  @Input() editPage: boolean;
  @Output() boundsChange = new EventEmitter(); // in html (boundsChange)="updateBounds($event)"
  map: L.Map;
  channelLayer: L.LayerGroup;
  drawnItems: L.FeatureGroup;
  icons: L.Icon[];
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
    this.updateMap();
  }

  ngOnChanges() {
    this.updateMap();
  }

  initMap(): void {
    this.channelLayer = L.layerGroup([]);
    this.drawnItems = new L.FeatureGroup();
    this.icons = [
      L.icon({ // orignal channelgroup icons
        iconUrl: '../../assets/original-cg-marker.png',
        shadowUrl: '',
        iconSize:     [36, 36], // size of the icon
        shadowSize:   [0, 0], // size of the shadow
        iconAnchor:   [18, 18], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0],  // the same for the shadow
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
      }),
      L.icon({ // current channelgroup icons
        iconUrl: '../../assets/current-cg-marker.png',
        shadowUrl: '',
        iconSize:     [36, 36], // size of the icon
        shadowSize:   [0, 0], // size of the shadow
        iconAnchor:   [18, 18], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0],  // the same for the shadow
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
      }),
      L.icon({ // searched channelgroup icons
        iconUrl: '../../assets/search-map-marker.png',
        shadowUrl: '',
        iconSize:     [36, 36], // size of the icon
        shadowSize:   [0, 0], // size of the shadow
        iconAnchor:   [18, 18], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0],  // the same for the shadow
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
      }),
      L.icon({ // channel icons for channels to be removed from cg
        iconUrl: '../../assets/remove-map-marker.png',
        shadowUrl: '',
        iconSize:     [36, 36], // size of the icon
        shadowSize:   [0, 0], // size of the shadow
        iconAnchor:   [18, 18], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0],  // the same for the shadow
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
      })
    ];
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
    if (this.channelLayer && this.selectedChannels !== undefined) {
      this.layers.pop();
      let sumLat = 0; // Sums used for recentering
      let sumLon = 0;
      const chanMarkers = []; // Marker array
      const chanLatLng = []; // Channel location array

      if (this.originalSelectedChannels !== undefined) { // Original channels on cg
        this.originalSelectedChannels.forEach( channel => { // Add selected
          sumLat += channel.lat;
          sumLon += channel.lon;
          chanLatLng.push([channel.lat, channel.lon]);
          chanMarkers.push(
            L.marker([channel.lat, channel.lon], {icon: this.icons[0]}).bindPopup(
              channel.stationCode.toUpperCase())
          );
        });
      }
      if (this.selectedChannels !== undefined) { // Current channels on channel group
        let selectedChannels = this.selectedChannels;
        if (this.editPage) {
          selectedChannels = this.selectedChannels.filter( channel => {
            return !this.originalSelectedChannels.some(  c => {
              return c.id === channel.id; // Check whether this channel is selected already
            });
          });
        }
        selectedChannels.forEach( channel => { // Add selected
          sumLat += channel.lat;
          sumLon += channel.lon;
          chanLatLng.push([channel.lat, channel.lon]);
          chanMarkers.push(
            L.marker([channel.lat, channel.lon], {icon: this.icons[1]}).bindPopup(
              channel.stationCode.toUpperCase())
          );
        });
      }
      if (this.searchChannels !== undefined) { // channels being search for
        const filteredSearchChannels = this.searchChannels.filter( channel => {
          return !this.selectedChannels.some(  c => {
            return c.id === channel.id; // Check whether this channel is selected already
          });
        });
        filteredSearchChannels.forEach( channel => {
          sumLat += channel.lat;
          sumLon += channel.lon;
          chanLatLng.push([channel.lat, channel.lon]);
          chanMarkers.push(
            L.marker([channel.lat, channel.lon], {icon: this.icons[2]}).bindPopup(
              channel.stationCode.toUpperCase())
          ); // Push search channel markers onto array
        });
      }
      if (this.isRemoving) { // Channels to be removed
        this.removeChannels.forEach( channel => {
          chanMarkers.push(
            L.marker([channel.lat, channel.lon], {icon: this.icons[3]}).bindPopup(
              channel.stationCode.toUpperCase())
          ); // Push search channel markers onto array
        });
      }
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
