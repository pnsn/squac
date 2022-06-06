import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  OnInit,
  SimpleChange,
  SimpleChanges,
  NgZone,
} from "@angular/core";
import { Channel } from "@core/models/channel";
import * as L from "leaflet";

@Component({
  selector: "channel-group-map",
  templateUrl: "./channel-group-map.component.html",
  styleUrls: ["./channel-group-map.component.scss"],
})
export class ChannelGroupMapComponent implements OnInit, OnChanges {
  @Input() channelsInGroup: Channel[];
  @Input() selectedChannels: Channel[];
  @Input() editPage: boolean;
  @Input() showChannel: Channel;
  @Output() showChannelChange = new EventEmitter<any>();
  @Output() boundsChange = new EventEmitter(); // in html (boundsChange)="updateBounds($event)"
  channelLayer: L.FeatureGroup;
  drawnItems: L.FeatureGroup;
  options: {
    center: L.LatLng;
    zoom: number;
    layers: L.Layer[];
  };
  legend: L.Control;
  drawOptions: Record<string, unknown>;
  layers: L.Layer[];
  fitBounds: L.LatLngBounds;
  rectLayer: any;
  map: L.Map;
  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.showChannel && this.showChannel) {
      this.selectChannels(this.showChannel);
    }
    if (changes.selectedChannels || changes.channelsInGroup) {
      console.log(changes);
      this.updateMap();
    }
  }

  initMap(): void {
    // Setup the groups for map markers and the drawn square
    this.channelLayer = new L.FeatureGroup();
    this.drawnItems = new L.FeatureGroup();

    this.legend = new L.Control({
      position: "bottomleft",
    });

    // Add all the layers to the array that will be fed to options
    this.layers = [
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }),
      this.drawnItems,
      this.channelLayer,
    ];

    const legend = L.DomUtil.get("legend");
    this.legend.onAdd = () => {
      return legend;
    };

    console.log("init", this.legend);

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
    console.log("ready");
    console.log("init", this.legend);
    this.map = map;
    this.legend.addTo(this.map);
    setTimeout(() => {
      this.map.invalidateSize();
      this.updateMap();
    }, 0);
  }

  selectChannels(channel) {
    let channelMarker;
    this.channelLayer.eachLayer((layer: any) => {
      if (layer.options.title === channel.nslc) {
        channelMarker = layer;
      }
      // layer.title === channel.nslc;
    });

    if (channelMarker) {
      console.log(channelMarker);
      channelMarker.openPopup();
    }
  }

  addSelectedChannels() {}

  addChannelsInGroup() {}

  updateMap() {
    if (this.channelLayer && this.selectedChannels) {
      this.layers.pop();
      let sumLat = 0; // Sums used for recentering
      let sumLon = 0;
      const chanMarkers = []; // Marker array
      const chanLatLng = []; // Channel location array

      // Add in the original channels, overwriting
      this.channelsInGroup?.forEach((channel) => {
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

      this.selectedChannels?.forEach((channel) => {
        // Add selected
        sumLat += channel.lat;
        sumLon += channel.lon;
        chanLatLng.push([channel.lat, channel.lon]);
        const marker = L.marker([channel.lat, channel.lon], {
          icon: L.divIcon({ className: "new-channels" }),
          title: channel.nslc,
        }).bindPopup(
          channel.networkCode.toUpperCase() +
            "." +
            channel.stationCode.toUpperCase()
        );
        marker.on("click", (ev) => {
          ev.target.openPopup();
          this.zone.run(() => {
            console.log("event clicked");
            this.showChannelChange.emit(channel);
          });
        });
        chanMarkers.push(marker);
      });

      this.channelLayer = L.featureGroup(chanMarkers);
      this.layers.push(this.channelLayer);
      if (chanMarkers.length > 0) {
        // Recenter and rezoom to fit
        this.options.center = L.latLng(
          sumLat / chanMarkers.length,
          sumLon / chanMarkers.length
        );
        this.fitBounds = this.channelLayer.getBounds();
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
