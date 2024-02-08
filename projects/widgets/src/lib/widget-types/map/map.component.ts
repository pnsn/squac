import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { PrecisionPipe } from "../../pipes/precision.pipe";

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
import { GenericWidgetComponent } from "../../components";
import { ChannelRow, StationChannels, StationRow } from "./types";
import { Channel, MeasurementPipe, MeasurementTypes, Metric } from "squacapi";
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
import { NgFor, NgIf } from "@angular/common";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { GuardTypePipe } from "../../pipes/guard-type.pipe";

interface ChannelData {
  nslc: string;
  value: number;
}
interface StationData {
  staCode: string;
  channelData: ChannelData[];
  lat: number;
  lon: number;
}

/**
 * Leaflet map widget that displays stations
 */
@Component({
  selector: "widget-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
  standalone: true,
  imports: [
    NgFor,
    LeafletDrawModule,
    LeafletModule,
    PrecisionPipe,
    NgIf,
    GuardTypePipe,
  ],
})
export class MapComponent
  extends GenericWidgetComponent
  implements OnInit, OnDestroy, WidgetTypeComponent
{
  /** element of legend on map*/
  @ViewChild("legendElement", { static: false }) public legendRef: ElementRef;
  /** map element ref */
  @ViewChild("mapElement", { static: false }) public mapRef: ElementRef;

  /** observer for page resizes */
  resizeObserver: ResizeObserver;
  /** station layers on map */
  stationLayer: LayerGroup;
  /** metric to display on map */
  displayMetric: Metric;
  /** Map configuration options */
  options: MapOptions;
  /** Map config for drawing */
  drawOptions: Record<string, never>;
  /** layers to display on map */
  layers: FeatureGroup[];
  /** map bounds */
  fitBounds: LatLngBounds;
  /** leaflet map instance */
  map: Map;
  /** map layers grouped by metric */
  metricLayers: Record<number, Marker[]>;
  /** Visual map for coloring icons */
  displayMap: VisualMapTypes;
  /** leaflet legend control */
  legend: Control;
  /** Station data */
  stations: StationRow[];
  /** transform measurements */
  measurementPipe = new MeasurementPipe();
  /** pipe for calculating prescisions */
  precisionPipe = new PrecisionPipe();

  /** typeguards */
  isPiecewise = isPiecewise;
  isStoplight = isStoplight;
  isContinuous = isContinuous;

  constructor(
    private widgetConfigService: WidgetConfigService,
    protected widgetConnectService: WidgetConnectService,
    override widgetManager: WidgetManagerService,
    protected zone: NgZone,
    override cdr: ChangeDetectorRef
  ) {
    super(widgetManager, widgetConnectService, zone);
  }

  /**
   * override to disable method
   *
   * @param _useDenseView unused
   */
  override useDenseView(_useDenseView: boolean): void {
    return;
  }

  /**
   * override to disable method
   *
   * @param _channel unused
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
  override updateData(data: MeasurementTypes[]): void {
    //overridden to allow check for if map exists
    this.data = data;
    this.channels = this.widgetManager.channels;
    this.selectedMetrics = this.widgetManager.selectedMetrics;
    this.properties = this.widgetManager.properties;
    if (this.map) {
      this.changeData(data);
    }
  }

  /**
   * trigger chart data set up & change metrics
   *
   * @param data data to add to the chart
   */
  changeData(data: MeasurementTypes[]): void {
    this.buildChartData(data).then(() => {
      this.changeMetrics();
      this.cdr.detectChanges();
      this.data = null;
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
      this.changeData(this.data);
    }
  }

  /**
   * emphasize channel on map
   *
   * @param channel nslc to emphasize
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
   * set up legend element and add to map
   */
  private initLegend(): void {
    const legend = this.legendRef?.nativeElement;
    this.legend.onAdd = (): HTMLElement => {
      return legend;
    };
    // only add legend to map if the map is ready
    // throws errors otherwise
    if (this.map && legend && this.showKey) {
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
   * Remove resize observer when map destroyed
   */
  override ngOnDestroy(): void {
    this.map = null;
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.mapRef.nativeElement);
    }
    super.ngOnDestroy();
  }

  /**
   * Creates map markers using processed data
   *
   * @param data processed data from request
   */
  buildChartData(data: MeasurementTypes[]): Promise<void> {
    return new Promise<void>((resolve) => {
      this.data = data;
      this.metricLayers = {};

      this.selectedMetrics.forEach((metric) => {
        if (!metric) return;
        const stationsData: StationData[] = [];
        this.channels.forEach((channel: Channel) => {
          let stationData = stationsData.find(
            (s) => channel.staCode === s.staCode
          );
          if (!stationData) {
            stationData = {
              staCode: channel.staCode,
              channelData: [],
              lat: channel.lat,
              lon: channel.lon,
            };
            stationsData.push(stationData);
          }
          let val: number = null;

          const channelData = data
            .filter((m) => m.channel === channel.id && m.metric === metric.id)
            .map((m) => {
              m.value = m.value ?? m[this.widgetManager.dataStat];
              return m;
            });

          val = this.measurementPipe.transform(
            channelData,
            this.widgetManager.stat
          );

          this.widgetConfigService.calculateDataRange(metric.id, val);

          stationData.channelData.push({
            nslc: channel.nslc,
            value: val,
          });

          // check if agg if worse than current agg
        });

        const visualMap = this.widgetConfigService.getVisualMapFromThresholds(
          [metric],
          this.properties,
          3
        )[metric.id];

        const stationMarkers = [];
        stationsData.forEach((station: StationData) => {
          // count of channels that are null or out of spec
          let outOfSpecChannels = 0;
          let stationHTML = "";
          let stationColor: string;

          let stationValue = Number.MIN_SAFE_INTEGER;

          station.channelData.forEach((channelData) => {
            stationValue = Math.max(Math.abs(channelData.value), stationValue);

            const val = channelData.value;
            const inRange = visualMap
              ? this.widgetConfigService.checkValue(val, visualMap)
              : true;

            if (val === null || (visualMap && !inRange)) {
              outOfSpecChannels++;
            }

            const color = this.getStyle(val, visualMap);
            const iconHtml = this.getIconHtml(color);

            stationHTML += `<tr> <td> ${iconHtml} ${
              channelData.nslc
            } </td><td> ${
              val !== null ? this.precisionPipe.transform(val) : "no data"
            }</td></tr>`;
          });

          if (isStoplight(visualMap)) {
            if (outOfSpecChannels === 0) {
              stationColor = visualMap.colors.in;
            } else if (outOfSpecChannels === station.channelData.length) {
              stationColor = visualMap.colors.out;
            } else {
              stationColor = visualMap.colors.middle;
            }
          } else {
            stationColor = this.getStyle(stationValue, visualMap);
          }

          //each layer is own feature group
          stationMarkers.push(
            this.makeStationMarker(station, stationHTML, stationColor)
          );
        });

        this.visualMaps[metric.id] = visualMap;
        this.metricLayers[metric.id] = stationMarkers;
      });
      resolve();
    });
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
   * Change metric to show on the map and resize after
   */
  changeMetrics(): void {
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
    if (
      value === Number.MIN_SAFE_INTEGER ||
      value === null ||
      value === undefined
    ) {
      return "transparent";
    }
    return this.widgetConfigService.getColorFromValue(value, visualMap);
  }

  /**
   * Makes leaflet marker for a station
   *
   * @param station - station to make marker for
   * @param stationHTML - station channels string
   * @param stationColor - string color
   * @returns leaflet marker for map
   */
  private makeStationMarker(
    station: StationData,
    stationHTML: string,
    stationColor: string
  ): Marker {
    const options: MarkerOptions = {
      autoPan: true,
      riseOnHover: true,
    };
    let html: string;
    if (stationColor) {
      html = this.getIconHtml(stationColor);
      if (stationColor === "transparent") {
        options.pane = "nodata";
      } else {
        options.pane = stationColor;
      }
    } else {
      html = this.getIconHtml("white");
    }

    options.icon = divIcon({ html, className: "icon-parent" });
    const markerObj = marker([station.lat, station.lon], options).bindTooltip(
      `<div class='tooltip-name'> ${station.staCode} </div> <table class='tooltip-table'>
        <thead><th>Channel</th><th>Value</th></thead><tbody>
      ${stationHTML}</tbody> </table>`
    );
    markerObj.on("click", (ev) => {
      ev.target.openPopup();
    });
    return markerObj;
  }
}
//no data, empty (?) white circle
//skip no data and show channel with data
