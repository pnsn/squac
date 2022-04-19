import { Component, Input, OnInit } from "@angular/core";
import { Channel } from "@core/models/channel";
import { ChannelGroup } from "@core/models/channel-group";
import { Metric } from "@core/models/metric";
import { Threshold } from "@features/widgets/models/threshold";
import { Widget } from "@features/widgets/models/widget";
import { MeasurementPipe } from "@features/widgets/pipes/measurement.pipe";
import * as L from "leaflet";
import { checkThresholds } from "@core/utils/utils";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
  providers: [MeasurementPipe],
})
export class MapComponent implements OnInit {
  @Input() widget: Widget;
  @Input() data;

  stations;
  stationLayer: L.LayerGroup;

  metrics: Metric[];
  thresholds: { [metricId: number]: Threshold };
  channelGroup: ChannelGroup;

  channels: Channel[];

  options: {
    center: L.LatLng;
    zoom: number;
    layers: L.Layer[];
  };
  drawOptions: Record<string, never>;
  layers: L.Layer[];
  fitBounds: L.LatLngBounds;
  rectLayer: any;
  map: L.Map;
  constructor(private measurementPipe: MeasurementPipe) {}

  ngOnInit() {
    if (this.widget) {
      this.initMap();
    }
  }

  // ngOnChanges() {
  //   this.updateMap();
  // }

  initMap(): void {
    // Setup the groups for map markers and the drawn square

    // Add all the layers to the array that will be fed to options
    this.layers = [
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }),
    ];

    this.metrics = this.widget.metrics;
    this.thresholds = this.widget.thresholds;
    this.channelGroup = this.widget.channelGroup;
    if (this.channelGroup) {
      this.channels = this.channelGroup.channels;
    }

    this.buildRows(this.data);

    // Giving options before view is initialized seemed to be causing issues with the map, so for init just fed it undefineds
    this.options = {
      center: L.latLng(45.0, -120.0),
      zoom: 5,
      layers: this.layers,
    };
  }

  onMapReady(map: L.Map) {
    let metric: Metric;
    let threshold: Threshold;
    if (this.metrics) {
      metric = this.metrics[0];
      threshold = this.thresholds[metric.id];
    }
    this.map = map;

    const legend = new L.Control({ position: "bottomright" });
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "legend");

      if (threshold) {
        div.innerHTML +=
          "<h4>" +
          threshold.min +
          " ≤ in threshold ≤ " +
          threshold.max +
          "</h4>";
      }
      div.innerHTML +=
        '<p><div class="in-spec "></div>' + "Within Threshold</p>";
      div.innerHTML +=
        '<p><div class="out-of-spec "></div>' + "Outside Threshold</p>";
      div.innerHTML += '<p><div class="unknown"></div>' + "No Threshold</p>";

      return div;
    };
    legend.addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
      // this.updateMap();
    }, 0);
  }

  // modified from tabular, needs a another look
  private buildRows(data) {
    const rows = [];
    const stations = [];
    const stationRows = [];
    const stationChannels = {};

    const metric = this.metrics[0];
    this.channels.forEach((channel) => {
      const identifier = channel.networkCode + "." + channel.stationCode;
      const statType = this.widget.stattype.type;
      let agg = 0;

      let val: number = null;

      if (data[channel.id] && data[channel.id][metric.id]) {
        const rowData = data[channel.id][metric.id];

        // if it has value, show value else find the staType to show
        if (rowData[0] && rowData[0].value) {
          if (rowData.length > 0) {
            val = this.measurementPipe.transform(rowData, statType);
          } else {
            val = rowData[0].value;
          }
          // still need to calculate
        } else if (rowData[0][statType]) {
          val = rowData[0][statType];
        }
      }

      const threshold = this.thresholds[metric.id];
      const inThreshold = threshold ? checkThresholds(threshold, val) : false;

      if (threshold && val != null && !inThreshold) {
        agg++;
      }

      let iconClass: string;

      if (!threshold) {
        iconClass = "no-threshold";
      } else if (val !== null && !inThreshold && !!threshold) {
        iconClass = "out-of-spec";
      } else if (val !== null && inThreshold && !!threshold) {
        iconClass = "in-spec";
      } else {
        iconClass = "unknown";
      }

      if (!stationChannels[channel.stationCode]) {
        stationChannels[channel.stationCode] = "";
      }

      stationChannels[channel.stationCode] =
        stationChannels[channel.stationCode] +
        `<p> <div class="${iconClass}"> </div>${channel.loc}.${channel.code}: ${
          val ? val : "no data"
        }</p>`;

      const title =
        channel.networkCode +
        "." +
        channel.stationCode +
        "." +
        channel.loc +
        "." +
        channel.code;
      let row = {
        title,
        id: channel.id,
        parentId: identifier,
        staCode: channel.stationCode,
        netCode: channel.networkCode,
        lat: channel.lat,
        lon: channel.lon,
        class: iconClass,
        agg,
      };
      row = { ...row };
      rows.push(row);

      const staIndex = stations.indexOf(identifier);
      if (staIndex < 0) {
        stations.push(identifier);
        stationRows.push({
          ...{
            title,
            id: identifier,
            staCode: channel.stationCode,
            netCode: channel.networkCode,
            lat: channel.lat,
            lon: channel.lon,
            class: iconClass,
            agg,
          },
        });
      } else {
        stationRows[staIndex] = this.findWorstChannel(
          row,
          stationRows[staIndex]
        );
        // check if agg if worse than current agg
      }
    });

    this.stations = [];
    stationRows.forEach((station) => {
      if (!station.staCode) {
        console.log(station);
      }

      const marker = L.marker([station.lat, station.lon], {
        icon: L.divIcon({ className: station.class }),
      })
        .bindPopup(
          `<h4> ${station.netCode.toUpperCase()}.${station.staCode.toUpperCase()} </h4>
        ${stationChannels[station.staCode]}`
        )
        .bindTooltip(
          `${station.netCode.toUpperCase()}.${station.staCode.toUpperCase()}`
        );

      marker.on("click", (ev) => {
        ev.target.openPopup();
      });

      this.stations.push(marker);
    });
    this.stationLayer = L.layerGroup(this.stations);

    this.layers.push(this.stationLayer);
  }

  private findWorstChannel(channel, station) {
    if (channel.agg > station.agg) {
      const newStation = { ...channel };
      newStation.id = station.id;
      newStation.parentId = null; // It is the parent now
      return newStation;
    }
    return station;
  }
}
