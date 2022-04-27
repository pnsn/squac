import { Component, OnInit, Input, ViewChild, OnDestroy } from "@angular/core";
import { ColumnMode, SortType } from "@swimlane/ngx-datatable";
import { MeasurementPipe } from "@features/widget/pipes/measurement.pipe";
import { Subscription } from "rxjs";
import { ViewService } from "@core/services/view.service";
import { ChannelGroup } from "@core/models/channel-group";
import { Widget } from "@features/widget/models/widget";
import { Metric } from "@core/models/metric";
import { Threshold } from "@features/widget/models/threshold";
import { Channel } from "@core/models/channel";
import { checkThresholds } from "@core/utils/utils";

@Component({
  selector: "widget-tabular",
  templateUrl: "./tabular.component.html",
  styleUrls: ["./tabular.component.scss"],
  providers: [MeasurementPipe],
})
export class TabularComponent implements OnInit, OnDestroy {
  @Input() widget: Widget;
  @Input() data;

  metrics: Metric[];
  thresholds: { [metricId: number]: Threshold };
  channelGroup: ChannelGroup;

  channels: Channel[];

  subscription = new Subscription();

  @ViewChild("dataTable") table: any;
  ColumnMode = ColumnMode;
  SortType = SortType;
  rows = [];
  columns = [];
  messages = {
    // Message to show when array is presented
    // but contains no values
    emptyMessage: "Loading data.",

    // Footer total message
    totalMessage: "total",

    // Footer selected message
    selectedMessage: "selected",
  };

  // rows = [];
  constructor(
    private viewService: ViewService,
    private measurementPipe: MeasurementPipe
  ) {}

  ngOnInit() {
    this.metrics = this.widget.metrics;
    this.metrics.forEach((metric) => {
      metric.comparator = this.metricComparator.bind(this);
    });

    this.thresholds = this.widget.thresholds;
    this.channelGroup = this.widget.channelGroup;
    if (this.channelGroup) {
      this.channels = this.channelGroup.channels;
    }

    this.buildRows(this.data);

    const resizeSub = this.viewService.resize.subscribe(
      (widgetId) => {
        if (!widgetId || widgetId === this.widget.id) {
          this.resize();
        }
      },
      (error) => {
        console.log("error in tabular resize: " + error);
      }
    );

    this.subscription.add(resizeSub);
  }

  private metricComparator(propA, propB) {
    const result = propA.value - propB.value;
    return result;
  }

  private resize() {
    setTimeout(() => {
      this.table.recalculate();
    }, 500);
  }

  private findWorstChannel(channel, station) {
    if (channel.agg > station.agg) {
      const newStation = { ...channel };
      newStation.treeStatus = station.treeStatus;
      newStation.id = station.id;
      newStation.parentId = null;
      return newStation;
    }
    return station;
  }

  private buildRows(data) {
    const rows = [];
    const stations = [];
    const stationRows = [];
    this.channels.forEach((channel) => {
      const identifier = channel.networkCode + "." + channel.stationCode;

      let agg = 0;
      const rowMetrics = {};

      this.metrics.forEach((metric) => {
        const statType = this.widget.stattype.type;

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
          } else if (
            rowData[0][statType] !== undefined &&
            rowData[0][statType] !== null
          ) {
            val = rowData[0][statType];
          }
        }

        // const val = this.measurement.transform(data[channel.id][metric.id], this.widget.stattype.id);
        const threshold = this.thresholds[metric.id];
        const inThreshold = threshold ? checkThresholds(threshold, val) : false;

        if (threshold && val != null && !inThreshold) {
          agg++;
        }
        rowMetrics[metric.id] = {
          value: val,
          classes: {
            "out-of-spec": val !== null && !inThreshold && !!threshold,
            "in-spec": val !== null && inThreshold && !!threshold,
            "has-threshold": !!threshold,
          },
        };
      });
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
        nslc: channel.nslc,
        parentId: identifier,
        treeStatus: "disabled",
        agg,
      };
      row = { ...row, ...rowMetrics };
      rows.push(row);

      const staIndex = stations.indexOf(identifier);
      if (staIndex < 0) {
        stations.push(identifier);
        stationRows.push({
          ...{
            title,
            id: identifier,
            treeStatus: "collapsed",
            staCode: channel.stationCode,
            netCode: channel.networkCode,
            agg,
          },
          ...rowMetrics,
        });
      } else {
        stationRows[staIndex] = this.findWorstChannel(
          row,
          stationRows[staIndex]
        );
        // check if agg if worse than current agg
      }
    });
    this.rows = [...stationRows, ...rows];
  }

  onTreeAction(event: any) {
    // const index = event.rowIndex;
    const row = event.row;
    if (row.treeStatus === "collapsed") {
      row.treeStatus = "loading";
      row.treeStatus = "expanded";
      this.rows = [...this.rows];
    } else {
      row.treeStatus = "collapsed";
      this.rows = [...this.rows];
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getCellClass({ row, column, _value }): any {
    return row[column.prop].classes;
  }
}
