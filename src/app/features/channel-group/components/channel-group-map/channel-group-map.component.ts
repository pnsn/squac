import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges,
  NgZone,
} from "@angular/core";
import { Channel } from "@core/models/channel";
import * as L from "leaflet";

// shared map for channels
@Component({
  selector: "channel-group-map",
  templateUrl: "./channel-group-map.component.html",
  styleUrls: ["./channel-group-map.component.scss"],
})
export class ChannelGroupMapComponent implements OnInit, OnChanges {
  @Input() inGroupChannels: Channel[]; // channels already in group
  @Input() selectedChannels: Channel[]; // channels selected
  @Input() editPage: boolean; //is used on edit page or not
  @Input() showChannel: Channel; // channel to show
  @Output() showChannelChange = new EventEmitter<any>(); //channel to show changed
  @Output() boundsChange = new EventEmitter(); // in html (boundsChange)="updateBounds($event)"

  //leaflet stuff
  stationLayer: L.FeatureGroup;
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
    if (changes.selectedChannels || changes.inGroupChannels) {
      this.updateMap(!!changes.showChannel);
    }
    if (!changes.selectedChannels && changes.showChannel) {
      this.selectChannels(this.showChannel);
    }
  }

  initMap(): void {
    // Setup the groups for map markers and the drawn square
    this.stationLayer = new L.FeatureGroup();
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
      this.stationLayer,
    ];

    const legend = L.DomUtil.get("legend");
    this.legend.onAdd = () => {
      return legend;
    };

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

  // leaflet event for when map has loaded
  // can save map and init things on map now
  onMapReady(map: L.Map): void {
    this.map = map;
    this.legend.addTo(this.map);
    setTimeout(() => {
      this.map.invalidateSize();
      this.updateMap(false);
    }, 0);
  }

  // find station to show when channel is selected
  selectChannels(channel: Channel): void {
    if (channel) {
      let stationMarker;
      this.stationLayer.eachLayer((layer: any) => {
        if (
          layer.options.title ===
          channel.networkCode + "." + channel.stationCode
        ) {
          stationMarker = layer;
        }
        // layer.title === channel.nslc;
      });

      if (stationMarker) {
        stationMarker.openPopup();
      }
    }
  }

  // Create markers for each station
  updateMap(showChannel: boolean): void {
    const stations = [];
    if (this.stationLayer) {
      this.layers.pop();
      const stationMarkers = []; // Marker array

      this.inGroupChannels?.forEach((channel) => {
        let station = stations.find((s) => {
          return s.code === channel.networkCode + "." + channel.stationCode;
        });

        if (!station) {
          // make station if there isn't one yet
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

        // check if station is already in the group
        const index = station.inGroupChannels.findIndex(
          (c) => c.id === channel.id
        );

        if (index > -1) {
          //remove channel from ingroups to stop duplicates
          station.inGroupChannels.splice(index, 1);
        }
        station.selectedChannels.push(channel);
      });

      //make marker for each station
      stations.forEach((station) => {
        const marker = this.makeMarker(station);
        stationMarkers.push(marker);
      });

      // create layer from markers
      this.stationLayer = L.featureGroup(stationMarkers);
      this.layers.push(this.stationLayer);

      // adjust bounds to fit stations
      if (stationMarkers.length > 0) {
        this.map.fitBounds(this.stationLayer.getBounds(), {
          padding: [11, 11],
        });
      }
      // show selected channel
      if (showChannel) {
        this.selectChannels(this.showChannel);
      }
    }
  }

  // Make leaflet marker for station
  makeMarker(station): L.Marker {
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
        //ToDO: need to actually select channels
        this.showChannelChange.emit(station);
      });
    });

    return marker;
  }

  // Clear out old stuff and remove bounds
  onDrawStart(): void {
    this.drawnItems.clearLayers();
    this.boundsChange.emit("");
  }

  // Send out newly drawn bounds
  onRectangleCreated(e: any): void {
    this.rectLayer = e.layer;
    this.drawnItems.addLayer((e as L.DrawEvents.Created).layer);
    this.boundsChange.emit(""); // Clear old bounds
    const rectangleNE = this.rectLayer._bounds._northEast; // Northeast corner lat lng
    const rectangleSW = this.rectLayer._bounds._southWest; // Southwest corner lat lng
    const latLngBounds = `${rectangleNE.lat} ${rectangleSW.lng} ${rectangleSW.lat} ${rectangleNE.lng}`;
    // Convert SE and NE to upper left and NE and SW coordinates
    this.boundsChange.emit(latLngBounds);
  }

  // Listen to rectangle edit and change bounds
  onRectangleEdited(): void {
    this.boundsChange.emit(""); // Clear old bounds
    const rectangleNE = this.rectLayer._bounds._northEast; // Northeast corner lat lng
    const rectangleSW = this.rectLayer._bounds._southWest; // Southwest corner lat lng
    const latLngBounds = `${rectangleNE.lat} ${rectangleSW.lng} ${rectangleSW.lat} ${rectangleNE.lng}`;
    // Convert SE and NE to upper left and NE and SW coordinates
    this.boundsChange.emit(latLngBounds);
  }

  // clear bounds when rectangle deleted
  onRectangleDeleted(): void {
    this.boundsChange.emit(""); // Clear old bounds
  }
}
