import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import * as L from "leaflet";
import { PrecisionPipe } from "../../shared/pipes/precision.pipe";

import {
  WidgetConnectService,
  WidgetManagerService,
  WidgetConfigService,
} from "../../services";
import { WidgetTypeComponent } from "../../interfaces";
import { GenericWidgetComponent } from "../abstract-components";
import { ChannelRow, StationRow } from "./types";
import { MeasurementTypes, Metric } from "squacapi";

@Component({
  selector: "widget-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent
  extends GenericWidgetComponent
  implements OnInit, OnDestroy, WidgetTypeComponent
{
  @ViewChild("legendElement", { static: false }) public legendRef: ElementRef;
  @ViewChild("mapElement", { static: false }) public mapRef: ElementRef;

  resizeObserver: ResizeObserver;
  precisionPipe = new PrecisionPipe();
  stationLayer: L.LayerGroup;
  displayMetric: Metric;
  options: L.MapOptions;

  drawOptions: Record<string, never>;
  layers: L.FeatureGroup[];
  fitBounds: L.LatLngBounds;
  map: L.Map;
  metricLayers: Record<number, L.Marker[]>;
  displayMap;
  legend: L.Control;
  stations: StationRow[];

  constructor(
    private widgetConfigService: WidgetConfigService,
    protected widgetConnectService: WidgetConnectService,
    override widgetManager: WidgetManagerService
  ) {
    super(widgetManager, widgetConnectService);
  }

  deemphasizeChannel(_channel: string): void {
    return;
  }

  startZoom(): void {
    return;
  }

  configureChart(): void {
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
      doubleClickZoom: false,
    };
  }

  toggleKey(): void {
    //show
    if (this.showKey && this.map) {
      this.legend.addTo(this.map);
    } else if (this.legend) {
      this.legend.remove();
    }
  }

  onMapReady(map: L.Map): void {
    this.map = map;
    // Do stuff with map
    if (this.selectedMetrics.length > 0) {
      this.legend = new L.Control({
        position: "topright",
      });
      this.buildChartData(this.data).then(() => {
        this.changeMetrics();
      });
    }
  }

  emphasizeChannel(channel): void {
    // const layer = this.metricLayers[this.displayMetric.id];
    if (channel && this.stations) {
      const chan = channel.split(".");
      const stationId = chan[0] + "." + chan[1];

      const stationIndex = this.stations.findIndex((station) => {
        return station.id === stationId;
      });
      const layer = this.metricLayers[this.displayMetric.id];
      layer.forEach((marker, index) => {
        if (index !== stationIndex) {
          marker.closeTooltip();
        } else {
          const position = marker.getLatLng();
          this.map.setView(position);
          marker.openTooltip();
        }
      });
    }
  }

  private initLegend(): void {
    const legend = this.legendRef.nativeElement;
    this.legend.onAdd = (): any => {
      return legend;
    };
    if (this.map && this.legend) {
      this.legend.addTo(this.map);
    }
  }

  toggleColor(pane): void {
    const pane1 = this.map.getPane(pane);
    pane1.classList.toggle("hidden");
    const el = this.mapRef.nativeElement.getElementsByClassName(pane);
    if (el[0]) {
      el[0].classList.toggle("layer-hidden");
    }
    if (el[1]) {
      el[1].classList.toggle("layer-hidden");
    }
  }

  toggleStation(i, event): void {
    event.preventDefault();
    const el = this.mapRef.nativeElement.getElementsByClassName(i)[0];
    const layer = this.metricLayers[this.displayMetric.id];
    const station = layer[i];
    if (this.layers[0].hasLayer(station)) {
      this.layers[0].removeLayer(station);
      el.classList.add("layer-hidden");
    } else {
      this.layers[0].addLayer(station);

      el.classList.remove("layer-hidden");
    }

    event.stopPropagation();
    // ;
  }

  override ngOnDestroy(): void {
    this.map = null;
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.mapRef.nativeElement);
    }
    console.log("destroy");

    super.ngOnDestroy();
  }

  hoverStation(i, status): void {
    const layer = this.metricLayers[this.displayMetric.id];
    const station = layer[i];

    if (this.layers[0].hasLayer(station)) {
      if (status === "open") {
        station.openTooltip();
      } else {
        station.closeTooltip();
      }
    }
  }

  buildChartData(data): Promise<void> {
    return new Promise<void>((resolve) => {
      this.data = data;
      if (this.map) {
        this.metricLayers = {};

        //this.properties.displayType
        this.visualMaps = this.widgetConfigService.getVisualMapFromThresholds(
          this.selectedMetrics,
          this.properties,
          3
        );

        //properties.stationView === 'stoplight' || 'worst'
        this.selectedMetrics.forEach((metric) => {
          if (!metric) return;
          const channelRows: ChannelRow[] = [];
          const stations: string[] = [];
          const stationRows: StationRow[] = [];
          const stationChannels: Record<number, string> = {};

          this.channels.forEach((channel) => {
            const identifier = channel.staCode;
            const nslc = channel.nslc;
            let agg = 0;
            let val: number = null;
            if (data.get(channel.id)) {
              const rowData: MeasurementTypes = data
                .get(channel.id)
                .get(metric.id);
              val = rowData && rowData[0] ? rowData[0].value : val;
            }

            const visualMap = this.visualMaps[metric.id];
            const inRange = visualMap
              ? this.widgetConfigService.checkValue(val, visualMap)
              : true;

            if (val === null || (visualMap && !inRange)) {
              agg++;
            }
            const color = this.getStyle(val, visualMap);
            const iconHtml = this.getIconHtml(color);

            if (!stationChannels[channel.staCode]) {
              stationChannels[channel.staCode] = "";
            }

            stationChannels[channel.staCode] =
              stationChannels[channel.staCode] +
              `<tr> <td> ${iconHtml} ${nslc} </td><td> ${
                val !== null ? this.precisionPipe.transform(val) : "no data"
              }</td></tr>`;

            let channelRow: ChannelRow = {
              title: nslc,
              id: channel.id,
              parentId: identifier,
              staCode: channel.staCode,
              lat: channel.lat,
              lon: channel.lon,
              color,
              metricAgg: agg,
            };
            channelRow = { ...channelRow };
            channelRows.push(channelRow);
            let staIndex = stations.indexOf(identifier);
            if (staIndex < 0) {
              staIndex = stations.length;
              stations.push(identifier);
              const sta: StationRow = {
                id: identifier,
                staCode: channel.staCode,
                lat: channel.lat,
                lon: channel.lon,
                count: 0,
                agg,
                color,
                channelAgg: 0,
                metricAgg: 0,
              };
              stationRows.push(sta);
            }
            const station: StationRow = this.findWorstChannel(
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
          });
          const stationMarkers = [];

          stationRows.forEach((station) => {
            stationMarkers.push(
              this.makeStationMarker(station, stationChannels)
            );
          });
          //each layer is own feature group
          this.metricLayers[metric.id] = stationMarkers;
          this.stations = stationRows;
        });
      }
      resolve();
    });
  }

  private findWorstChannel(channel, station): StationRow {
    station.count++;
    if (channel.agg > station.agg) {
      station.agg = channel.agg;
      station.color = channel.color;
    }
    station.channelAgg += channel.metricAgg > 0 ? 1 : 0;
    station.metricAgg += channel.metricAgg;

    return station;
  }

  addPanes(visualMap): void {
    if (visualMap) {
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
        default: //no visualMap pane
          break;
      }
    } else {
      //no visual map
      this.map.createPane("gray");
    }

    this.map.createPane("nodata"); //no data pane
  }

  changeMetrics(): void {
    if (this.map) {
      this.displayMetric = this.selectedMetrics[0];
      this.displayMap = this.visualMaps[this.displayMetric.id];
      this.addPanes(this.displayMap);
      this.layers = [L.featureGroup(this.metricLayers[this.displayMetric.id])];
      this.initLegend();
      this.fitBounds = this.layers[0].getBounds();

      this.resizeObserver = new ResizeObserver(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
        this.fitBounds = this.layers[0].getBounds();
      });

      this.resizeObserver.observe(this.mapRef.nativeElement);
    }
  }

  private getIconHtml(color?: string): string {
    let htmlString = `<div style='background-color: ${color}' class='map-icon `;
    if (color === "white" || color === "transparent") {
      htmlString += "border";
    }
    htmlString += `'></div>`;
    return htmlString;
  }

  private getStyle(value, visualMap): string {
    if (value === null || value === undefined) {
      return "transparent";
    }
    return this.widgetConfigService.getColorFromValue(value, visualMap);
  }

  private makeStationMarker(station, stationChannels): L.Marker {
    const options: L.MarkerOptions = {
      autoPan: true,
      riseOnHover: true,
    };
    let html;
    if (station.color) {
      html = this.getIconHtml(station.color);
      if (station.color === "transparent") {
        options.pane = "nodata";
      } else {
        options.pane = station.color;
      }
    } else {
      html = this.getIconHtml("white");
    }

    options.icon = L.divIcon({ html, className: "icon-parent" });
    const marker = L.marker([station.lat, station.lon], options).bindTooltip(
      `<div class='tooltip-name'> ${
        station.id
      } </div> <table class='tooltip-table'>
        <thead><th>Channel</th><th>Value</th></thead><tbody>
      ${stationChannels[station.staCode]}</tbody> </table>`
    );
    marker.on("click", (ev) => {
      ev.target.openPopup();
    });
    return marker;
  }
}
//no data, empty (?) white circle
//skip no data and show channel with data
