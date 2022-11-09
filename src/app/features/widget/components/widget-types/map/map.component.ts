import { Component, OnDestroy, OnInit } from "@angular/core";
import * as L from "leaflet";
import { WidgetConfigService } from "@features/widget/services/widget-config.service";
import { PrecisionPipe } from "@shared/pipes/precision.pipe";
import { timeout } from "d3";
import { WidgetConnectService } from "@features/widget/services/widget-connect.service";
import { WidgetManagerService } from "@features/widget/services/widget-manager.service";
import { GenericWidgetComponent } from "../interfaces/generic-widget.component";
import { WidgetTypeComponent } from "../interfaces/widget-type.interface";

@Component({
  selector: "widget-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent
  extends GenericWidgetComponent
  implements OnInit, OnDestroy, WidgetTypeComponent
{
  any;

  resizeObserver;
  precisionPipe = new PrecisionPipe();
  stationLayer: L.LayerGroup;
  displayMetric;
  options: any;

  drawOptions: Record<string, never>;
  layers: L.FeatureGroup[];
  fitBounds: L.LatLngBounds;
  rectLayer: any;
  map: L.Map;
  metricLayers: { [metricId: number]: L.Marker[] };
  displayMap;
  legend;
  stations;

  constructor(
    private widgetTypeService: WidgetConfigService,
    protected widgetConnectService: WidgetConnectService,
    protected widgetManager: WidgetManagerService
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

  toggleKey() {
    //show
    if (this.showKey && this.map) {
      this.legend.addTo(this.map);
    } else if (this.legend) {
      this.legend.remove();
    }
  }

  onMapReady(map: L.Map) {
    timeout(() => {
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
    }, 0);
  }

  emphasizeChannel(channel) {
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

  private initLegend() {
    const legend = L.DomUtil.get("legend");
    this.legend.onAdd = () => {
      return legend;
    };
    this.legend.addTo(this.map);
  }

  toggleColor(pane) {
    const pane1 = this.map.getPane(pane);
    pane1.classList.toggle("hidden");
    const el = document.getElementsByClassName(pane);
    if (el[0]) {
      el[0].classList.toggle("layer-hidden");
    }
    if (el[1]) {
      el[1].classList.toggle("layer-hidden");
    }
  }

  toggleStation(i, event) {
    event.preventDefault();
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

    event.stopPropagation();
    // ;
  }

  ngOnDestroy(): void {
    this.map = null;
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(document.getElementById("map"));
    }

    super.ngOnDestroy();
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
  }

  buildChartData(data) {
    return new Promise<void>((resolve) => {
      this.data = data;
      if (this.map) {
        this.metricLayers = {};

        //this.properties.displayType
        this.visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
          this.selectedMetrics,
          this.properties,
          3
        );

        //properties.stationView === 'stoplight' || 'worst'
        this.selectedMetrics.forEach((metric) => {
          if (!metric) return;
          const channelRows = [];
          const stations = [];
          const stationRows = [];
          const stationChannels = {};

          this.channels.forEach((channel) => {
            const identifier = channel.staCode;
            const nslc = channel.nslc;
            let agg = 0;
            let val: number = null;
            if (data.get(channel.id)) {
              const rowData = data.get(channel.id).get(metric.id);
              val = rowData && rowData[0] ? rowData[0].value : val;
            }

            const visualMap = this.visualMaps[metric.id];
            const inRange = visualMap
              ? this.widgetTypeService.checkValue(val, visualMap)
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

            let channelRow = {
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
              stationRows.push({
                ...{
                  id: identifier,
                  staCode: channel.staCode,
                  lat: channel.lat,
                  lon: channel.lon,
                  count: 0,
                  agg,
                  color,
                  channelAgg: 0,
                  metricAgg: 0,
                },
              });
            }
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

  private findWorstChannel(channel, station) {
    station.count++;
    if (channel.agg > station.agg) {
      station.agg = channel.agg;
      station.color = channel.color;
    }
    station.channelAgg += channel.metricAgg > 0 ? 1 : 0;
    station.metricAgg += channel.metricAgg;

    return station;
  }

  addPanes(visualMap) {
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

  changeMetrics() {
    if (this.map) {
      this.displayMetric = this.selectedMetrics[0];
      this.displayMap = this.visualMaps[this.displayMetric.id];
      this.addPanes(this.displayMap);
      this.layers = [L.featureGroup(this.metricLayers[this.displayMetric.id])];
      this.initLegend();
      this.fitBounds = this.layers[0].getBounds();
      this.resizeObserver = new ResizeObserver(() => {
        this.map.invalidateSize();
        this.fitBounds = this.layers[0].getBounds();
      });

      this.resizeObserver.observe(document.getElementById("map"));
    }
  }

  private getIconHtml(color?: string) {
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
    return this.widgetTypeService.getColorFromValue(value, visualMap);
  }

  private makeStationMarker(station, stationChannels) {
    const options: any = {
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
