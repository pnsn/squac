import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { Channel } from "@core/models/channel";
import { Metric } from "@core/models/metric";
import { Threshold } from "@widget/models/threshold";
import * as L from "leaflet";
import { WidgetTypeComponent } from "../widget-type.component";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import { PrecisionPipe } from "@shared/pipes/precision.pipe";

@Component({
  selector: "widget-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
  providers: [WidgetTypeService],
})
export class MapComponent implements OnInit, OnChanges, WidgetTypeComponent {
  @Input() data;
  @Input() metrics: Metric[];
  @Input() thresholds: Threshold[];
  @Input() channels: Channel[];
  @Input() dataRange: any;
  @Input() selectedMetrics: Metric[];
  @Input() showStationList: boolean;
  @Input() properties: any;
  precisionPipe = new PrecisionPipe();
  stationLayer: L.LayerGroup;
  displayMetric;
  options: {
    center: L.LatLng;
    zoom: number;
    layers: L.Layer[];
  };
  drawOptions: Record<string, never>;
  layers: L.FeatureGroup[];
  fitBounds: L.LatLngBounds;
  rectLayer: any;
  map: L.Map;
  metricLayers: { [metricId: number]: L.Marker[] };
  visualMaps;
  legend;
  stationList;
  stations;

  constructor(private widgetTypeService: WidgetTypeService) {}

  ngOnInit() {
    this.initMap();
  }

  initMap(): void {
    // Add all the layers to the array that will be fed to options
    const baseLayers = [
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }),
    ];

    this.options = {
      center: L.latLng(0, 0),
      zoom: 5,
      layers: baseLayers,
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

    if (changes.showStationList) {
      this.legendToggle();
    }
  }

  legendToggle() {
    //show
    if (this.showStationList) {
      this.stationList.addTo(this.map);
    } else if (this.stationList) {
      this.stationList.remove();
    }
  }
  onMapReady(map: L.Map) {
    this.map = map;
    // Do stuff with map
    if (this.selectedMetrics.length > 0) {
      this.legend = new L.Control({
        position: "bottomleft",
      });
      this.stationList = new L.Control({ position: "topright" });
      this.buildLayers();
      this.changeMetric();
    }
  }

  private initLegend() {
    const legend = L.DomUtil.get("legend");
    this.legend.onAdd = () => {
      return legend;
    };

    this.legend.addTo(this.map);
  }

  private initStationList() {
    const stationList = L.DomUtil.get("station-list");
    this.stationList.onAdd = () => {
      return stationList;
    };
  }

  private toggleLayer(event) {
    console.log(event);
  }

  toggleColor(pane) {
    const pane1 = this.map.getPane(pane);
    pane1.classList.toggle("hidden");
    const el = document.getElementsByClassName(pane)[0];
    el.classList.toggle("layer-hidden");
  }

  toggleStation(i, $event) {
    const el = document.getElementsByClassName(i)[0];
    const layer = this.metricLayers[this.displayMetric.id];
    const station = layer[i];
    if (this.layers[0].hasLayer(station)) {
      this.layers[0].removeLayer(station);
      el.classList.add("layer-hidden");
    } else {
      this.layers[0].addLayer(station);

      el.classList.remove("layer-hidden");
    }

    $event.stopPropagation();
    // ;
  }

  hoverStation(i, status) {
    const layer = this.metricLayers[this.displayMetric.id];
    const station = layer[i];

    if (this.layers[0].hasLayer(station)) {
      if (status === "open") {
        station.openTooltip();
      } else {
        station.closeTooltip();
      }
    }
    // ;
  }

  private buildLayers() {
    const data = this.data;
    this.metricLayers = {};

    //this.properties.displayType
    this.visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
      this.selectedMetrics,
      this.thresholds,
      this.properties,
      this.dataRange,
      3
    );
    //properties.stationView === 'stoplight' || 'worst'
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
        const inRange = visualMap
          ? this.widgetTypeService.checkValue(val, visualMap)
          : true;
        if (visualMap && val != null && !inRange) {
          agg++;
        }
        const color = this.getColor(val, visualMap);
        const iconHtml = this.getIconHtml(color);

        if (!stationChannels[channel.stationCode]) {
          stationChannels[channel.stationCode] = "";
        }

        stationChannels[channel.stationCode] =
          stationChannels[channel.stationCode] +
          `<tr> <td> ${iconHtml} </td> <td> ${channel.nslc} </td><td> ${
            val !== null ? this.precisionPipe.transform(val) : "no data"
          }</td></tr>`;

        let channelRow = {
          title: channel.nslc,
          id: channel.id,
          parentId: identifier,
          staCode: channel.stationCode,
          lat: channel.lat,
          lon: channel.lon,
          color,
          html: iconHtml,
          metricAgg: agg,
        };
        channelRow = { ...channelRow };
        channelRows.push(channelRow);

        const staIndex = stations.indexOf(identifier);
        if (staIndex < 0) {
          stations.push(identifier);
          stationRows.push({
            ...{
              id: identifier,
              staCode: channel.stationCode,
              lat: channel.lat,
              lon: channel.lon,
              html: iconHtml,
              color,
              agg,
              channelAgg: agg > 0 ? 1 : 0, //number of channels out of spec
              metricAgg: agg, // number of metrics&channels out
              count: 1,
            },
          });
        } else {
          const station = this.findWorstChannel(
            channelRow,
            stationRows[staIndex]
          );
          if (visualMap?.type === "stoplight") {
            let color;
            if (station.channelAgg === 0) {
              color = visualMap.colors.in;
            } else if (station.channelAgg === station.count) {
              color = visualMap.colors.out;
            } else {
              color = visualMap.colors.middle;
            }
            station.color = color;
          }

          stationRows[staIndex] = station;

          // check if agg if worse than current agg
        }
      });
      const stationMarkers = [];

      stationRows.forEach((station) => {
        stationMarkers.push(this.makeStationMarker(station, stationChannels));
      });
      //each layer is own feature group
      this.metricLayers[metric.id] = stationMarkers;
      this.stations = stationRows;
    });
  }

  addPanes(visualMap) {
    switch (visualMap.type) {
      case "stoplight":
        this.map.createPane(visualMap.colors.in);
        this.map.createPane(visualMap.colors.out);
        this.map.createPane(visualMap.colors.middle);
        break;
      case "continuous":
        visualMap.inRange.color.forEach((color) => {
          this.map.createPane(color);
        });
        this.map.createPane(visualMap.outOfRange.color[0]);
        break;
      case "piecewise":
        visualMap.pieces.forEach((piece) => {
          this.map.createPane(piece.color);
        });
        this.map.createPane(visualMap.outOfRange.color[0]);

        break;
      default:
        break;
    }
  }

  changeMetric() {
    this.displayMetric = this.selectedMetrics[0];
    const visualMap = this.visualMaps[this.displayMetric.id];
    if (visualMap) {
      this.addPanes(visualMap);
    }

    this.layers = [L.featureGroup(this.metricLayers[this.displayMetric.id])];

    this.initLegend();
    this.initStationList();
    const resizeObserver = new ResizeObserver(() => {
      this.map.invalidateSize();
      this.fitBounds = this.layers[0].getBounds();
    });

    resizeObserver.observe(document.getElementById("map"));
  }

  private getIconHtml(color?: string) {
    const htmlString = `<div style='background-color: ${color}' class='map-icon'></div>`;
    return htmlString;
  }

  private getColor(value, visualMap) {
    let color;
    if (!visualMap) {
      color = "gray";
    } else if (value !== null) {
      color = this.widgetTypeService.getColorFromValue(value, visualMap);
    } else {
      color = "white";
    }
    return color;
  }

  private makeStationMarker(station, stationChannels) {
    const options: any = {
      autoPan: true,
    };
    let html;
    if (station.color) {
      html = `<div style='background-color: ${station.color}' class='map-icon'></div>`;
      options.pane = station.color;
    } else {
      html = station.html;
    }
    options.icon = L.divIcon({ html, className: "icon-parent" });
    const marker = L.marker([station.lat, station.lon], options)
      // .bindPopup(
      //   `<h4> ${station.netCode.toUpperCase()}.${station.staCode.toUpperCase()} </h4> <table>
      //   <thead><th colspan='2'>channel</th><th>value</th></thead>
      // ${stationChannels[station.staCode]} </table>`
      // )
      .bindTooltip(
        `<h4> ${station.id} </h4> <table>
        <thead><th colspan='2'>channel</th><th>value</th></thead>
      ${stationChannels[station.staCode]} </table>`
      );

    marker.on("click", (ev) => {
      ev.target.openPopup();
    });
    return marker;
  }
  private findWorstChannel(channel, station) {
    station.count++;
    if (channel.agg > station.agg) {
      station.html = channel.html;
      station.agg = channel.agg;
      station.color = channel.color;
    }
    station.channelAgg += channel.metricAgg > 0 ? 1 : 0;
    station.metricAgg += channel.metricAgg;

    return station;
  }
}
