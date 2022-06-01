import {
  Component,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { Channel } from "@core/models/channel";
import { ChannelGroup } from "@core/models/channel-group";
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
  @Input() channelGroup: ChannelGroup;
  @Input() thresholds: Threshold[];
  @Input() channels: Channel[];
  @Input() dataRange: any;
  @Input() selectedMetrics: Metric[];
  @Input() showStationList: boolean;
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

  constructor(
    private widgetTypeService: WidgetTypeService,
    private zone: NgZone
  ) {}

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

  private initLegend(metric, visualMap) {
    this.legend.onAdd = () => {
      const legend = L.DomUtil.get("legend");
      return legend;
    };

    this.legend.addTo(this.map);
  }

  private initStationList() {
    this.stationList.onAdd = () => {
      return L.DomUtil.get("station-list");
    };
  }

  private toggleLayer(event) {
    console.log(event);
  }

  toggleColor(piece) {
    console.log(piece);
  }

  toggleStation(i, $event) {
    const el = document.getElementsByClassName(i)[0];
    const layer = this.metricLayers[this.displayMetric.id];
    const station = layer[i];
    if (this.layers[0].hasLayer(station)) {
      this.layers[0].removeLayer(station);
      el.classList.add("offMap");
    } else {
      this.layers[0].addLayer(station);

      el.classList.remove("offMap");
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

    this.visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
      this.selectedMetrics,
      this.thresholds,
      this.dataRange,
      3
    );

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
        const inRange = visualMap ? this.checkValue(val, visualMap) : true;
        if (visualMap && val != null && !inRange) {
          agg++;
        }

        const iconHtml = this.getIconHtml(val, visualMap);

        if (!stationChannels[channel.stationCode]) {
          stationChannels[channel.stationCode] = "";
        }
        stationChannels[channel.stationCode] =
          stationChannels[channel.stationCode] +
          `<tr> <td> ${iconHtml} </td> <td> ${channel.nslc} </td><td> ${
            val ? this.precisionPipe.transform(val) : "no data"
          }</td></tr>`;

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
      const stationMarkers = [];
      stationRows.forEach((station) => {
        stationMarkers.push(this.makeMarker(station, stationChannels));
      });
      this.metricLayers[metric.id] = stationMarkers;
      this.stations = stationRows;
    });
  }

  checkValue(value, visualMap): boolean {
    let hasMin;
    let hasMax;
    if (visualMap.range) {
      hasMin = value >= visualMap.range[0];
      hasMax = value <= visualMap.range[1];
    } else {
      hasMin = visualMap.min !== null ? value >= visualMap.min : true;
      hasMax = visualMap.max !== null ? value <= visualMap.max : true;
    }
    return hasMin && hasMax;
  }

  changeMetric() {
    this.visualMaps;
    this.displayMetric = this.selectedMetrics[0];

    this.layers = [L.featureGroup(this.metricLayers[this.displayMetric.id])];
    this.initLegend(this.displayMetric, this.visualMaps[this.displayMetric.id]);
    this.initStationList();
    const resizeObserver = new ResizeObserver(() => {
      this.map.invalidateSize();
      this.fitBounds = this.layers[0].getBounds();
    });

    resizeObserver.observe(document.getElementById("map"));
  }

  private getIconHtml(value, visualMap) {
    let color = "white";
    if (!visualMap) {
      color = "white";
    } else if (value !== null) {
      color = this.widgetTypeService.getColorFromValue(value, visualMap);
    }
    const htmlString = `<div style='background-color: ${color}' class='map-icon'></div>`;
    return htmlString;
  }

  private makeMarker(station, stationChannels) {
    if (!station.staCode) {
      console.log(station);
    }

    const marker = L.marker([station.lat, station.lon], {
      autoPan: true,
      icon: L.divIcon({ html: station.html, className: "icon-parent" }),
    })
      // .bindPopup(
      //   `<h4> ${station.netCode.toUpperCase()}.${station.staCode.toUpperCase()} </h4> <table>
      //   <thead><th colspan='2'>channel</th><th>value</th></thead>
      // ${stationChannels[station.staCode]} </table>`
      // )
      .bindTooltip(
        `<h4> ${station.netCode.toUpperCase()}.${station.staCode.toUpperCase()} </h4> <table>
        <thead><th colspan='2'>channel</th><th>value</th></thead>
      ${stationChannels[station.staCode]} </table>`
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
