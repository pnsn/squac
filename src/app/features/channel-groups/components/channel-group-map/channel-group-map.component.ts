import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  OnInit,
} from "@angular/core";
import { Channel } from "@core/models/channel";
import * as L from "leaflet";

@Component({
  selector: "app-channel-group-map",
  templateUrl: "./channel-group-map.component.html",
  styleUrls: ["./channel-group-map.component.scss"],
})
export class ChannelGroupMapComponent implements OnInit, OnChanges {
  @Input() originalSelectedChannels: Channel[];
  @Input() selectedChannels: Channel[];
  @Input() searchChannels: Channel[];
  @Input() removeChannels: Channel[];
  @Input() isRemoving: boolean;
  @Input() editPage: boolean;
  @Output() boundsChange = new EventEmitter(); // in html (boundsChange)="updateBounds($event)"
  channelLayer: L.LayerGroup;
  drawnItems: L.FeatureGroup;
  options: {
    center: L.LatLng;
    zoom: number;
    layers: L.Layer[];
  };
  drawOptions: Record<string, unknown>;
  layers: L.Layer[];
  fitBounds: L.LatLngBounds;
  rectLayer: any;
  map: L.Map;

  ngOnInit() {
    this.initMap();
  }

  ngOnChanges() {
    this.updateMap();
  }

  initMap(): void {
    // Setup the groups for map markers and the drawn square
    this.channelLayer = L.layerGroup([]);
    this.drawnItems = new L.FeatureGroup();

    // Add all the layers to the array that will be fed to options
    this.layers = [
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }),
      this.drawnItems,
      this.channelLayer,
    ];

    // Giving options before view is initialized seemed to be causing issues with the map, so for init just fed it undefineds
    this.options = {
      center: L.latLng(45.0, -120.0),
      zoom: 5,
      layers: this.layers,
    };

    // Options for the drawing menu
    this.drawOptions = {
      position: "topright",
      draw: {
        polygon: false,
        polyline: false,
        rectangle: {
          showArea: false, // disable showArea
        },
        circle: false,
        circlemarker: false,
        marker: false,
      },
      edit: { featureGroup: this.drawnItems },
    };
  }

  onMapReady(map: L.Map) {
    this.map = map;
    setTimeout(() => {
      this.map.invalidateSize();
      this.updateMap();
    }, 0);
  }

  updateMap() {
    if (this.channelLayer && this.selectedChannels !== undefined) {
      this.layers.pop();
      let sumLat = 0; // Sums used for recentering
      let sumLon = 0;
      const chanMarkers = []; // Marker array
      const chanLatLng = []; // Channel location array

      // Add in the original channels, overwriting
      if (this.originalSelectedChannels !== undefined) {
        // Original channels on cg
        this.originalSelectedChannels.forEach((channel) => {
          // Add selected
          sumLat += channel.lat;
          sumLon += channel.lon;
          chanLatLng.push([channel.lat, channel.lon]);
          chanMarkers.push(
            L.marker([channel.lat, channel.lon], {
              icon: L.divIcon({ className: "original-channels" }),
            }).bindPopup(channel.stationCode.toUpperCase())
          );
        });
      }
      // Current channels on channel group
      if (this.selectedChannels !== undefined) {
        let selectedChannels = this.selectedChannels;
        if (this.editPage) {
          selectedChannels = this.selectedChannels.filter((channel) => {
            return !this.originalSelectedChannels.some((c) => {
              return c.id === channel.id; // Check whether this channel is selected already
            });
          });
        }
        selectedChannels.forEach((channel) => {
          // Add selected
          sumLat += channel.lat;
          sumLon += channel.lon;
          chanLatLng.push([channel.lat, channel.lon]);
          chanMarkers.push(
            L.marker([channel.lat, channel.lon], {
              icon: L.divIcon({ className: "new-channels" }),
            }).bindPopup(channel.stationCode.toUpperCase())
          );
        });
      }
      // Add channels being search for
      if (this.searchChannels !== undefined) {
        const filteredSearchChannels = this.searchChannels.filter((channel) => {
          return !this.selectedChannels.some((c) => {
            return c.id === channel.id; // Check whether this channel is selected already
          });
        });
        filteredSearchChannels.forEach((channel) => {
          sumLat += channel.lat;
          sumLon += channel.lon;
          chanLatLng.push([channel.lat, channel.lon]);
          chanMarkers.push(
            L.marker([channel.lat, channel.lon], {
              icon: L.divIcon({ className: "filtered-channels" }),
            }).bindPopup(channel.stationCode.toUpperCase())
          ); // Push search channel markers onto array
        });
      }
      // Add channels to be removed
      if (this.isRemoving) {
        this.removeChannels.forEach((channel) => {
          chanMarkers.push(
            L.marker([channel.lat, channel.lon], {
              icon: L.divIcon({ className: "remove-channels" }),
            }).bindPopup(channel.stationCode.toUpperCase())
          ); // Push search channel markers onto array
        });
      }
      this.channelLayer = L.layerGroup(chanMarkers);
      this.layers.push(this.channelLayer);
      if (chanMarkers.length > 0) {
        // Recenter and rezoom to fit
        this.options.center = L.latLng(
          sumLat / chanMarkers.length,
          sumLon / chanMarkers.length
        );
        this.map.fitBounds(L.latLngBounds(chanLatLng));
      }
    }
  }

  // Clear out old stuff and remove bounds
  onDrawStart() {
    this.drawnItems.clearLayers();
    this.boundsChange.emit("");
  }

  // Send out newly drawn bounds
  onRectangleCreated(e: any) {
    this.rectLayer = e.layer;
    this.boundsChange.emit(""); // Clear old bounds
    const rectangleNE = this.rectLayer._bounds._northEast; // Northeast corner lat lng
    const rectangleSW = this.rectLayer._bounds._southWest; // Southwest corner lat lng
    const latLngBounds = `${rectangleNE.lat} ${rectangleSW.lng} ${rectangleSW.lat} ${rectangleNE.lng}`;
    // Convert SE and NE to upper left and NE and SW coordinates
    this.boundsChange.emit(latLngBounds);
  }

  onRectangleEdited() {
    this.boundsChange.emit(""); // Clear old bounds
    const rectangleNE = this.rectLayer._bounds._northEast; // Northeast corner lat lng
    const rectangleSW = this.rectLayer._bounds._southWest; // Southwest corner lat lng
    const latLngBounds = `${rectangleNE.lat} ${rectangleSW.lng} ${rectangleSW.lat} ${rectangleNE.lng}`;
    // Convert SE and NE to upper left and NE and SW coordinates
    this.boundsChange.emit(latLngBounds);
  }

  onRectangleDeleted() {
    this.boundsChange.emit(""); // Clear old bounds
  }
}
