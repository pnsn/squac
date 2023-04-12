import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { PrecisionPipe } from "../../shared/pipes/precision.pipe";

import {
  WidgetConnectService,
  WidgetManagerService,
  WidgetConfigService,
} from "../../services";
import {
  isPiecewise,
  VisualMapTypes,
  WidgetTypeComponent,
  isContinuous,
  isStoplight,
  ProcessedData,
} from "../../interfaces";
import { GenericWidgetComponent } from "../../shared/components";
import { ChannelRow, StationChannels, StationRow } from "./types";
import { MeasurementPipe, MeasurementTypes, Metric } from "squacapi";
import {
  Control,
  divIcon,
  FeatureGroup,
  featureGroup,
  latLng,
  LatLngBounds,
  LayerGroup,
  Map,
  MapOptions,
  Marker,
  marker,
  MarkerOptions,
  tileLayer,
} from "leaflet";

/**
 * Leaflet map widget
 */
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
  stationLayer: LayerGroup;
  displayMetric: Metric;
  options: MapOptions;

  drawOptions: Record<string, never>;
  layers: FeatureGroup[];
  fitBounds: LatLngBounds;
  map: Map;
  metricLayers: Record<number, Marker[]>;
  displayMap: VisualMapTypes;
  legend: Control;
  stations: StationRow[];
  measurementPipe = new MeasurementPipe();

  isPiecewise = isPiecewise;
  isStoplight = isStoplight;
  isContinuous = isContinuous;

  constructor(
    private widgetConfigService: WidgetConfigService,
    protected widgetConnectService: WidgetConnectService,
    override widgetManager: WidgetManagerService,
    protected zone: NgZone
  ) {
    super(widgetManager, widgetConnectService, zone);
  }

  /** @override */
  override useDenseView(_useDenseView: boolean): void {
    return;
  }

  /**
   * @override
   */
  deemphasizeChannel(_channel: string): void {
    return;
  }

  /**
   * Should trigger zoom, but currently not available
   */
  startZoom(): void {
    return;
  }

  /**
   * @override
   */
  configureChart(): void {
    // Add all the layers to the array that will be fed to options
    const baseLayers = [
      tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }),
    ];

    this.options = {
      center: latLng(0, 0),
      zoom: 5,
      layers: baseLayers,
      doubleClickZoom: false,
      preferCanvas: true,
    };
  }

  /**
   * Update widget data
   *
   * @param data - data for widget to update
   */
  override updateData(data: ProcessedData): void {
    this.data = data;
    this.channels = this.widgetManager.channels;
    this.selectedMetrics = this.widgetManager.selectedMetrics;
    this.properties = this.widgetManager.properties;
    this.buildChartData(data).then(() => {
      this.changeMetrics();
    });
  }

  /**
   * @override
   */
  toggleKey(): void {
    //show
    if (this.showKey && this.map) {
      this.legend.addTo(this.map);
    } else if (this.legend) {
      this.legend.remove();
    }
  }

  /**
   * Store map once ready
   *
   * @param map - Leaflet map referencea
   */
  onMapReady(map: Map): void {
    this.map = map;
    // Do stuff with map
    if (this.selectedMetrics.length > 0) {
      this.legend = new Control({
        position: "topright",
      });
      this.buildChartData(this.data).then(() => {
        this.changeMetrics();
        this.toggleKey();
        this.data = null;
      });
    }
  }

  /**
   * @override
   */
  emphasizeChannel(channel: string): void {
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

  /**
   * set up legend elemend and add to map
   */
  private initLegend(): void {
    const legend = this.legendRef.nativeElement;
    this.legend.onAdd = (): HTMLElement => {
      return legend;
    };
    if (this.map && this.legend) {
      this.legend.addTo(this.map);
    }
  }

  /**
   * Toggle map pane with inputted color
   *
   * @param pane - string name of pane (will be color)
   */
  toggleColor(pane: string): void {
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

  /**
   * Toggle individual station, currently unused
   *
   * @param i - index of station
   * @param event - click event
   */
  toggleStation(i: number, event: any): void {
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

  /**
   * @override
   */
  override ngOnDestroy(): void {
    this.map = null;
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.mapRef.nativeElement);
    }
    super.ngOnDestroy();
  }

  /**
   * @override
   */
  buildChartData(data: ProcessedData): Promise<void> {
    return new Promise<void>((resolve) => {
      this.data = data;
      if (this.map) {
        this.metricLayers = {};

        this.visualMaps = this.widgetConfigService.getVisualMapFromThresholds(
          this.selectedMetrics,
          this.properties,
          3
        );

        this.selectedMetrics.forEach((metric) => {
          if (!metric) return;
          const channelRows: ChannelRow[] = [];
          const stations: string[] = [];
          const stationRows: StationRow[] = [];
          const stationChannels: StationChannels = {};
          this.channels.forEach((channel) => {
            const identifier = channel.staCode;
            const nslc = channel.nslc;
            let agg = 0;
            let val: number = null;
            if (data.get(channel.id)) {
              const rowData: MeasurementTypes[] = data
                .get(channel.id)
                .get(metric.id);
              val = this.measurementPipe.transform(
                rowData,
                this.widgetManager.stat
              );
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

            if (isStoplight(visualMap)) {
              let color: string;
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

  /**
   * Commpares station value and channel value, updates station
   * with channel values if channel values are worse than station values
   *
   * @param channel - channel to compare against station
   * @param station - current station data
   * @returns station updated with data for the worst channel
   */
  private findWorstChannel(
    channel: ChannelRow,
    station: StationRow
  ): StationRow {
    station.count++;
    if (channel.agg > station.agg) {
      station.agg = channel.agg;
      station.color = channel.color;
    }
    station.channelAgg += channel.metricAgg > 0 ? 1 : 0;
    station.metricAgg += channel.metricAgg;

    return station;
  }

  /**
   * Add panes to map
   *
   * @param visualMap - visual map type
   */
  addPanes(visualMap: VisualMapTypes): void {
    if (visualMap) {
      switch (visualMap.type) {
        case "stoplight":
          if ("colors" in visualMap) {
            this.map.createPane(visualMap.colors.in);
            this.map.createPane(visualMap.colors.out);
            this.map.createPane(visualMap.colors.middle);
          }
          break;
        case "continuous":
          visualMap.inRange.color.forEach((color) => {
            this.map.createPane(color);
          });
          this.map.createPane(visualMap.outOfRange.color[0]);
          break;
        case "piecewise":
          if ("pieces" in visualMap) {
            visualMap.pieces.forEach((piece) => {
              this.map.createPane(piece.color);
            });
          }
          this.map.createPane(visualMap.outOfRange.color[0]);

          break;
      }
    } else {
      //no visual map
      this.map.createPane("gray");
    }

    this.map.createPane("nodata"); //no data pane
  }

  /**
   * @override
   */
  changeMetrics(): void {
    if (this.map) {
      this.displayMetric = this.selectedMetrics[0];
      this.displayMap = this.visualMaps[this.displayMetric.id];
      this.addPanes(this.displayMap);
      this.layers = [featureGroup(this.metricLayers[this.displayMetric.id])];
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

  /**
   * Returns html string for map icon
   *
   * @param color - string color of icon
   * @returns html string for map icon
   */
  private getIconHtml(color?: string): string {
    let htmlString = `<div style='background-color: ${color}' class='map-icon `;
    if (color === "white" || color === "transparent") {
      htmlString += "border";
    }
    htmlString += `'></div>`;
    return htmlString;
  }

  /**
   * Finds correct color for given value based on visualmap
   *
   * @param value - value to check
   * @param visualMap - visual map to use
   * @returns string color
   */
  private getStyle(value: number, visualMap: VisualMapTypes): string {
    if (value === null || value === undefined) {
      return "transparent";
    }
    return this.widgetConfigService.getColorFromValue(value, visualMap);
  }

  /**
   * Makes leaflet marker for a station
   *
   * @param station - station to make marker for
   * @param stationChannels - station channels
   * @returns leaflet marker for map
   */
  private makeStationMarker(
    station: StationRow,
    stationChannels: StationChannels
  ): Marker {
    const options: MarkerOptions = {
      autoPan: true,
      riseOnHover: true,
    };
    let html: string;
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

    options.icon = divIcon({ html, className: "icon-parent" });
    const markerObj = marker([station.lat, station.lon], options).bindTooltip(
      `<div class='tooltip-name'> ${
        station.id
      } </div> <table class='tooltip-table'>
        <thead><th>Channel</th><th>Value</th></thead><tbody>
      ${stationChannels[station.staCode]}</tbody> </table>`
    );
    markerObj.on("click", (ev) => {
      ev.target.openPopup();
    });
    return markerObj;
  }
}
//no data, empty (?) white circle
//skip no data and show channel with data
