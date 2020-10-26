import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Channel } from '@core/models/channel';
import { ChannelGroup } from '@core/models/channel-group';
import { Metric } from '@core/models/metric';
import { Threshold } from '@features/widgets/models/threshold';
import { Widget } from '@features/widgets/models/widget';
import { MeasurementPipe } from '@features/widgets/pipes/measurement.pipe';
import * as L from 'leaflet';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [MeasurementPipe]
})
export class MapComponent implements OnInit {
  @Input() widget: Widget;
  @Input() data;

  stations;
  stationLayer: L.LayerGroup;


  metrics: Metric[];
  thresholds: {[metricId: number]: Threshold};
  channelGroup: ChannelGroup;

  channels: Channel[];

  options: {
    center: L.LatLng,
    zoom: number,
    layers: L.Layer[]
  };
  drawOptions: { };
  layers: L.Layer[];
  fitBounds: L.LatLngBounds;
  rectLayer: any;
  map: L.Map;
  icon;
  constructor(
    private measurement: MeasurementPipe
  ) { }

  ngOnInit() {
    this.initMap();
  }

  // ngOnChanges() {
  //   this.updateMap();
  // }

  initMap(): void {
    // Setup the groups for map markers and the drawn square

    // Add all the layers to the array that will be fed to options
    this.layers = [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ];

    this.icon = L.divIcon({className: 'my-div-icon'});


    this.metrics = this.widget.metrics;
    this.thresholds = this.widget.thresholds;
    this.channelGroup = this.widget.channelGroup;
    if ( this.channelGroup) {
      this.channels = this.channelGroup.channels;
    }

    this.buildRows(this.data);

    // Giving options before view is initialized seemed to be causing issues with the map, so for init just fed it undefineds
    this.options = {
      center: L.latLng(45.0000, -120.0000),
      zoom: 5,
      layers: this.layers
    };

  }

  onMapReady(map: L.Map) {
    this.map = map;
    setTimeout(() => {
      this.map.invalidateSize();
      // this.updateMap();
    }, 0);
  }

  //modified from tabular, needs a another look
  private buildRows(data) {
    const rows = [];
    const stations = [];
    const stationRows = [];

    const metric = this.metrics[0];
    this.channels.forEach((channel, index) => {
      const identifier = channel.networkCode + '.' + channel.stationCode;

      let agg = 0;

      const val = this.measurement.transform(data[channel.id][metric.id], this.widget.stattype.id);
      const threshold = this.thresholds[metric.id];
      const inThreshold = threshold ? this.checkThresholds(threshold, val) : false;

      if (threshold && val != null && !inThreshold) {
          agg++;
        }

      let iconClass: string;

      if (!threshold) {
          iconClass = 'no-threshold';
        } else if ( val !== null && !inThreshold && !!threshold){
          iconClass = 'out-of-spec';
        } else if ( val !== null && inThreshold && !!threshold) {
          iconClass = 'in-spec';
        } else {
          iconClass = 'unknown'
        }


      const title = channel.networkCode + '.' + channel.stationCode + '.' + channel.loc + '.' + channel.code;
      let row = {
        title,
        id: channel.id,
        parentId: identifier,
        staCode: channel.stationCode,
        netCode: channel.networkCode,
        lat: channel.lat,
        lon: channel.lon,
        class: iconClass,
        agg
      };
      row = {...row};
      rows.push(row);

      const staIndex = stations.indexOf(identifier);
      if (staIndex < 0) {
        stations.push(identifier);
        stationRows.push(
          {
            ...{
          title,
          id: identifier,
          staCode: channel.stationCode,
          netCode: channel.networkCode,
          lat: channel.lat,
          lon: channel.lon,
          class: iconClass,
          agg
          }
        }
        );
        
      } else {
        stationRows[staIndex] = this.findWorstChannel(row, stationRows[staIndex]);
        // check if agg if worse than current agg
      }



    });

    this.stations = [];
    stationRows.forEach(station => {
      if(!station.staCode) {
        console.log(station)
      }
      this.stations.push(
        L.marker([station.lat, station.lon], {
          icon:  L.divIcon({className: station.class})
        }).bindPopup(
        station.staCode.toUpperCase()
        )
      );

    });
    this.stationLayer = L.layerGroup(this.stations);

    this.layers.push(this.stationLayer);
  }

  private findWorstChannel(channel, station) {
    if ( channel.agg > station.agg ) {
      const newStation = {...channel};
      newStation.id = station.id;
      newStation.parentId = null; //It is the parent now
      return newStation;

    }
    return  station;
  }


  // TODO: yes, this is bad boolean but I'm going to change it
  checkThresholds(threshold, value): boolean {
    let withinThresholds = true;
    if (threshold.max !== null && value !== null && value > threshold.max) {
      withinThresholds = false;
    }
    if (threshold.min !== null && value !== null && value < threshold.min) {
      withinThresholds = false;
    }

    // TODO: is no thresholds in or out
    if (threshold.min === null && threshold.max === null) {
      withinThresholds = false;
    }
    return withinThresholds;
  }
}
