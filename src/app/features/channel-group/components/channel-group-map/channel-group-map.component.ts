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
      console.log("changes");
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
      center: L.latLng(0, 0),
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
    this.legend.addTo(this.map);
    setTimeout(() => {
      this.map.invalidateSize();
      this.updateMap();
    }, 0);
  }

  selectChannels(channel: Channel) {
    console.log(channel);
    let channelMarker;
    this.channelLayer.eachLayer((layer: any) => {
      if (
        layer.options.title ===
        channel.networkCode + "." + channel.stationCode
      ) {
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

  // findStationByChannel(channel) {

  // }

  updateMap() {
    const stations = [];
    //station
    // {
    //   code:
    //   selectedChannels:
    //   notSelectedChannels:
    // }

    // stations.filter(s =>{
    //   s.code = channel.networkCode + "." + channel.staCode;
    // })
    if (this.channelLayer) {
      this.layers.pop();
      const stationMarkers = []; // Marker array

      console.log(this.channelsInGroup, this.selectedChannels);
      //fixme - needs to be done by station??
      this.channelsInGroup?.forEach((channel) => {
        let station = stations.find((s) => {
          return s.code === channel.networkCode + "." + channel.stationCode;
        });

        if (!station) {
          station = {
            code: channel.networkCode + "." + channel.stationCode,
            lat: channel.lat,
            lon: channel.lon,
            inGroupChannels: [],
            selectedChannels: [],
          };
          stations.push(station);
        }

        station.inGroupChannels.push(channel);
        // const marker = this.makeMarker(channel, "original-channels");
        // chanMarkers.push(marker);
      });

      this.selectedChannels?.forEach((channel) => {
        let station = stations.find((s) => {
          return s.code === channel.networkCode + "." + channel.stationCode;
        });

        if (!station) {
          station = {
            code: channel.networkCode + "." + channel.stationCode,
            lat: channel.lat,
            lon: channel.lon,
            inGroupChannels: [],
            selectedChannels: [],
          };
          stations.push(station);
        }

        station.selectedChannels.push(channel);
        // const marker = this.makeMarker(channel, "new-channels");
        // chanMarkers.push(marker);
      });
      console.log(stations);
      stations.forEach((station) => {
        const marker = this.makeMarker(station);
        stationMarkers.push(marker);
      });

      this.channelLayer = L.featureGroup(stationMarkers);
      this.layers.push(this.channelLayer);

      this.fitBounds = this.channelLayer.getBounds();
    }
  }

  makeMarker(station) {
    let selectedChannelString = "";
    let inGroupChannelString = "";

    station.inGroupChannels.forEach((channel) => {
      inGroupChannelString +=
        "<div> <div class='original-channels map-icon'></div>" +
        channel.nslc +
        "</div>";
    });
    station.selectedChannels.forEach((channel) => {
      selectedChannelString +=
        "<div> <div class='new-channels map-icon'></div>" +
        channel.nslc +
        "</div>";
    });

    let className = "";

    if (station.inGroupChannels.length !== 0) {
      className = "original-channels";
    }
    if (station.selectedChannels.length !== 0) {
      className = "new-channels";
    }

    const popup = `<h4> ${station.code} </h4> <div class='channel-list'>${selectedChannelString}</div> <div class='channel-list'>${inGroupChannelString} </div>`;
    const marker = L.marker([station.lat, station.lon], {
      icon: L.divIcon({ className: className }),
      title: station.code,
    }).bindPopup(popup);
    marker.on("click", (ev) => {
      ev.target.openPopup();
      this.zone.run(() => {
        //FIXME: need to actually select channels
        this.showChannelChange.emit(station);
      });
    });

    return marker;
  }

  // Clear out old stuff and remove bounds
  onDrawStart() {
    this.drawnItems.clearLayers();
    this.boundsChange.emit("");
  }

  // Send out newly drawn bounds
  onRectangleCreated(e: any) {
    this.rectLayer = e.layer;
    this.drawnItems.addLayer((e as L.DrawEvents.Created).layer);
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
