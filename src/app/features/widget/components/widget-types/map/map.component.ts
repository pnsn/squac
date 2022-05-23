import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { Channel } from "@core/models/channel";
import { ChannelGroup } from "@core/models/channel-group";
import { Metric } from "@core/models/metric";
import { Threshold } from "@widget/models/threshold";
import * as L from "leaflet";
import { checkThresholds } from "@core/utils/utils";
import { WidgetTypeComponent } from "../widget-type.component";

@Component({
  selector: "widget-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit, OnChanges, WidgetTypeComponent {
  @Input() data;
  @Input() metrics: Metric[];
  @Input() channelGroup: ChannelGroup;
  @Input() thresholds: Threshold[];
  @Input() channels: Channel[];
  @Input() dataRange: any;
  @Input() selectedMetrics: Metric[];
  stations;
  stationLayer: L.LayerGroup;

  options: {
    center: L.LatLng;
    zoom: number;
    layers: L.Layer[];
  };
  drawOptions: Record<string, never>;
  layers: L.Layer[] = [];
  fitBounds: L.LatLngBounds;
  rectLayer: any;
  map: L.Map;
  metricLayers: { [metricId: number]: L.FeatureGroup<L.Marker> };
  baseLayers;

  ngOnInit() {
    this.initMap();
  }

  initMap(): void {
    // Add all the layers to the array that will be fed to options
    this.layers = [
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }),
    ];

    this.options = {
      center: L.latLng(0, 0),
      zoom: 5,
      layers: this.layers,
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes.data || changes.selectedMetrics) &&
      this.channels.length > 0 &&
      this.selectedMetrics.length > 0 &&
      this.map
    ) {
      this.buildLayers();
      this.changeMetric();
    }
  }

  onMapReady(map: L.Map) {
    this.map = map;
    // Do stuff with map
    this.initLegend();
    if (this.selectedMetrics.length > 0) {
      this.buildLayers();
      this.changeMetric();
    }
  }

  private initLegend() {
    let threshold: Threshold;

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
  }

  private buildLayers() {
    const data = this.data;
    this.metricLayers = {};

    this.selectedMetrics.forEach((metric) => {
      const channelRows = [];
      const stations = [];
      const stationRows = [];
      const stationChannels = {};
      this.channels.forEach((channel) => {
        const identifier = channel.networkCode + "." + channel.stationCode;
        let agg = 0;
        let val: number = null;
        if (data[channel.id] && data[channel.id][metric.id]) {
          const rowData = data[channel.id][metric.id];
          val = rowData[0].value;
        }

        const threshold = this.thresholds[metric.id];
        const inThreshold = threshold ? checkThresholds(threshold, val) : false;

        if (threshold && val != null && !inThreshold) {
          agg++;
        }

        const iconClass = this.getIconClass(val, threshold, inThreshold);

        if (!stationChannels[channel.stationCode]) {
          stationChannels[channel.stationCode] = "";
        }
        stationChannels[channel.stationCode] =
          stationChannels[channel.stationCode] +
          `<p> <div class="${iconClass}"> </div>${channel.loc}.${
            channel.code
          }: ${val ? val : "no data"}</p>`;

        let channelRow = {
          title: channel.nslc,
          id: channel.id,
          parentId: identifier,
          staCode: channel.stationCode,
          netCode: channel.networkCode,
          lat: channel.lat,
          lon: channel.lon,
          class: iconClass,
          agg,
        };
        channelRow = { ...channelRow };
        channelRows.push(channelRow);

        const staIndex = stations.indexOf(identifier);
        if (staIndex < 0) {
          stations.push(identifier);
          stationRows.push({
            ...{
              title: channel.nslc,
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
            channelRow,
            stationRows[staIndex]
          );
          // check if agg if worse than current agg
        }
      });
      this.stations = [];
      stationRows.forEach((station) => {
        this.stations.push(this.makeMarker(station, stationChannels));
      });
      this.metricLayers[metric.id] = L.featureGroup(this.stations);
    });
  }

  changeMetric() {
    const layer = this.metricLayers[this.selectedMetrics[0].id];
    this.layers.pop();
    this.layers.push(layer);
    this.fitBounds = layer.getBounds();
  }

  private getIconClass(val, threshold, inThreshold) {
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
    return iconClass;
  }

  private makeMarker(station, stationChannels) {
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
    return marker;
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
