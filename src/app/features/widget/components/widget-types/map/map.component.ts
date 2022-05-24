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
import { WidgetTypeService } from "@features/widget/services/widget-type.service";

@Component({
  selector: "widget-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
  providers: [WidgetTypeService],
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
  visualMaps;
  legend;

  constructor(private widgetTypeService: WidgetTypeService) {}

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
    if (this.selectedMetrics.length > 0) {
      this.legend = new L.Control({ position: "bottomright" });
      this.buildLayers();
      this.changeMetric();
    }
  }

  private initLegend(metric, visualMap) {
    this.legend.onAdd = () => {
      const div = L.DomUtil.create("div", "legend");

      if (visualMap) {
        div.innerHTML += `<h4>${metric.name}</h4>`;
        div.innerHTML += `<p> ${this.getIconHtml(
          true,
          visualMap,
          true
        )} In Range</p>`;
        div.innerHTML += `<p> ${this.getIconHtml(
          true,
          visualMap,
          false
        )} Out of Range</p>`;
        div.innerHTML += `<p>${this.getIconHtml(
          null,
          visualMap,
          false
        )}No Value</p> `;
      } else {
        div.innerHTML += `<p>${this.getIconHtml(
          true,
          false,
          false
        )}No Range</p> `;
      }

      return div;
    };
    this.legend.addTo(this.map);
  }

  private buildLayers() {
    const data = this.data;
    this.metricLayers = {};

    this.visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
      this.selectedMetrics,
      this.thresholds,
      this.dataRange,
      3
    );
    console.log(this.selectedMetrics);

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

        const visualMap = this.visualMaps[metric.id];

        const threshold = this.thresholds[metric.id];
        const inRange =
          visualMap && val <= visualMap.max && val >= visualMap.min;

        if (threshold && val != null && !inRange) {
          agg++;
        }

        const iconHtml = this.getIconHtml(val, visualMap, inRange);

        if (!stationChannels[channel.stationCode]) {
          stationChannels[channel.stationCode] = "";
        }
        stationChannels[channel.stationCode] =
          stationChannels[channel.stationCode] +
          `<p> ${iconHtml} ${channel.loc}.${channel.code}: ${
            val ? val : "no data"
          }</p>`;

        let channelRow = {
          title: channel.nslc,
          id: channel.id,
          parentId: identifier,
          staCode: channel.stationCode,
          netCode: channel.networkCode,
          lat: channel.lat,
          lon: channel.lon,
          html: iconHtml,
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
              html: iconHtml,
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
    const displayMetric = this.selectedMetrics[0];
    const layer = this.metricLayers[displayMetric.id];
    this.layers.pop();
    this.layers.push(layer);
    setTimeout(() => {
      this.map.invalidateSize();
      this.fitBounds = layer.getBounds();
    }, 0);
    this.initLegend(displayMetric, this.visualMaps[displayMetric.id]);
  }

  private getIconHtml(val, visualMap, inRange) {
    let color;

    if (!visualMap) {
      color = "white";
    } else if (val !== null && !inRange) {
      color = visualMap.outOfRange.color[0];
    } else if (val !== null && inRange) {
      color = visualMap.inRange.color[0];
    } else {
      color = "gray";
    }
    const htmlString = `<div style='background-color: ${color}' class='map-icon'></div>`;
    return htmlString;
  }

  private makeMarker(station, stationChannels) {
    if (!station.staCode) {
      console.log(station);
    }

    const marker = L.marker([station.lat, station.lon], {
      icon: L.divIcon({ html: station.html, className: "icon-parent" }),
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
