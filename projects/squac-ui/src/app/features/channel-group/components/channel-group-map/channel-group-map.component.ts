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
import { Channel } from "squacapi";
import * as L from "leaflet";

export interface MapBounds {
  latMin: number;
  latMax: number;
  lonMin: number;
  lonMax: number;
}
// shared map for channels
@Component({
  selector: "channel-group-map",
  templateUrl: "./channel-group-map.component.html",
  styleUrls: ["./channel-group-map.component.scss"],
})
export class ChannelGroupMapComponent implements OnInit, OnChanges {
  @Input() searchedChannels: Channel[]; // channels already in group
  @Input() autoExcludeChannels: Channel[];
  @Input() autoIncludeChannels: Channel[];
  @Input() selectedChannels: Channel[]; // channels selected
  @Input() editPage: boolean; //is used on edit page or not
  @Input() showChannel: Channel; // channel to show
  @Output() showChannelChange = new EventEmitter<any>(); //channel to show changed
  @Output() boundsChange = new EventEmitter<MapBounds>(); // in html (boundsChange)="updateBounds($event)"

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
  lastZoom = null;

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["selectedChannels"] ||
      changes["autoIncludeChannels"] ||
      changes["autoExcludeChannels"] ||
      changes["searchedChannels"]
    ) {
      this.updateMap(!!changes["showChannel"]);
    }
    if (!changes["selectedChannels"] && changes["selectedChannels"]) {
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
    this.legend.onAdd = (): any => {
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
        if (layer.options.title === channel.staCode) {
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

      this.searchedChannels?.forEach((channel) => {
        let station = stations.find((s) => {
          return s.code === channel.staCode;
        });

        if (!station) {
          // make station if there isn't one yet
          station = {
            code: channel.staCode,
            lat: channel.lat,
            lon: channel.lon,
            autoIncludeChannels: [],
            autoExcludeChannels: [],
            selectedChannels: [],
            searchedChannels: [],
          };
          stations.push(station);
        }

        station.searchedChannels.push(channel);
      });

      this.autoIncludeChannels?.forEach((channel) => {
        let station = stations.find((s) => {
          return s.code === channel.staCode;
        });

        if (!station) {
          // make station if there isn't one yet
          station = {
            code: channel.staCode,
            lat: channel.lat,
            lon: channel.lon,
            autoIncludeChannels: [],
            autoExcludeChannels: [],
            selectedChannels: [],
            searchedChannels: [],
          };
          stations.push(station);
        }

        station.autoIncludeChannels.push(channel);
      });

      this.autoExcludeChannels?.forEach((channel) => {
        let station = stations.find((s) => {
          return s.code === channel.staCode;
        });

        if (!station) {
          // make station if there isn't one yet
          station = {
            code: channel.staCode,
            lat: channel.lat,
            lon: channel.lon,
            autoIncludeChannels: [],
            autoExcludeChannels: [],
            selectedChannels: [],
            searchedChannels: [],
          };
          stations.push(station);
        }

        station.autoExcludeChannels.push(channel);
      });

      this.selectedChannels?.forEach((channel) => {
        let station = stations.find((s) => {
          return s.code === channel.staCode;
        });

        if (!station) {
          station = {
            code: channel.staCode,
            lat: channel.lat,
            lon: channel.lon,
            autoIncludeChannels: [],
            autoExcludeChannels: [],
            selectedChannels: [],
            searchedChannels: [],
          };
          stations.push(station);
        }

        // check if station is already in the group
        const includeIndex = station.autoIncludeChannels.findIndex(
          (c) => c.id === channel.id
        );

        const excludeIndex = station.autoExcludeChannels.findIndex(
          (c) => c.id === channel.id
        );

        if (includeIndex > -1) {
          //remove channel from ingroups to stop duplicates
          station.autoIncludeChannels.splice(includeIndex, 1);
        }

        if (excludeIndex > -1) {
          station.autoExcludeChannels.splice(includeIndex, 1);
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

      // only reset map zoom & bounds if user hasn't yet
      if (!this.lastZoom || this.lastZoom !== "user") {
        try {
          // adjust bounds to fit stations
          const bounds = this.stationLayer.getBounds();
          this.map.fitBounds(bounds, {
            padding: [11, 11],
          });
        } catch {
          this.map.setZoom(1);
        }
        this.lastZoom = "auto";
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
    station.searchedChannels.forEach((channel) => {
      inGroupChannelString +=
        "<div> <div class='searched-channels map-icon'></div>" +
        channel.nslc +
        "</div>";
    });

    station.autoIncludeChannels.forEach((channel) => {
      inGroupChannelString +=
        "<div> <div class='included-channels map-icon'></div>" +
        channel.nslc +
        "</div>";
    });
    station.autoExcludeChannels.forEach((channel) => {
      inGroupChannelString +=
        "<div> <div class='excluded-channels map-icon'></div>" +
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

    if (station.searchedChannels.length !== 0) {
      className = "searched-channels";
    }

    if (station.autoIncludeChannels.length !== 0) {
      className = "included-channels";
    }
    if (station.autoExcludeChannels.length !== 0) {
      className = "excluded-channels";
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

  // after zoom triggers
  // if user changed bounds, don't override
  onZoomEnd(): void {
    if (this.lastZoom === "auto") {
      this.lastZoom = null;
    } else {
      this.lastZoom = "user";
    }
  }
  // Clear out old stuff and remove bounds
  onDrawStart(): void {
    this.drawnItems.clearLayers();
    // this.boundsChange.emit("");
  }

  // take leaflet rectangle and get bounds and emit results
  getBoundsFromRectangle(): void {
    const rectangleNE = this.rectLayer._bounds._northEast; // Northeast corner lat lng
    const rectangleSW = this.rectLayer._bounds._southWest; // Southwest corner lat lng
    const bounds: MapBounds = {
      latMax: rectangleNE.lat,
      latMin: rectangleSW.lat,
      lonMin: rectangleSW.lng,
      lonMax: rectangleNE.lng,
    };
    this.boundsChange.emit(bounds);
  }

  // Send out newly drawn bounds
  onRectangleCreated(e: any): void {
    this.rectLayer = e.layer;
    this.drawnItems.addLayer((e as L.DrawEvents.Created).layer);

    this.getBoundsFromRectangle();
  }

  // Listen to rectangle edit and change bounds
  onRectangleEdited(): void {
    this.getBoundsFromRectangle();
  }

  // clear bounds when rectangle deleted
  onRectangleDeleted(): void {
    this.boundsChange.emit(); // Clear old bounds
  }
}