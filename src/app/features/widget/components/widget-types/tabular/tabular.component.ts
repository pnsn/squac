import {
  Component,
  Input,
  Output,
  ViewChild,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  TemplateRef,
  EventEmitter,
  OnInit,
} from "@angular/core";
import { ColumnMode, SelectionType, SortType } from "@swimlane/ngx-datatable";
import { Subscription } from "rxjs";
import { Metric } from "@core/models/metric";
import { Threshold } from "@widget/models/threshold";
import { Channel } from "@core/models/channel";
import { WidgetTypeComponent } from "../widget-type.component";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import { WidgetConnectService } from "@features/widget/services/widget-connect.service";

@Component({
  selector: "widget-tabular",
  templateUrl: "./tabular.component.html",
  styleUrls: ["./tabular.component.scss"],
  providers: [WidgetTypeService],
})
export class TabularComponent
  implements OnInit, OnDestroy, OnChanges, WidgetTypeComponent
{
  @Input() data;
  @Input() metrics: Metric[];
  @Input() thresholds: Threshold[];
  @Input() channels: Channel[];
  @Input() dataRange: any;
  @Input() selectedMetrics: Metric[];
  @Input() properties: any;
  @Input() loading: string | boolean;
  @Output() loadingChange = new EventEmitter();
  subscription = new Subscription();
  visualMaps;

  @ViewChild("dataTable") table: any;
  @ViewChild("cellTemplate") cellTemplate: TemplateRef<any>;
  @ViewChild("headerTemplate") headerTemplate: TemplateRef<any>;
  ColumnMode = ColumnMode;
  SortType = SortType;
  SelectionType = SelectionType;
  rows = [];
  columns = [];
  selectedRow;
  emphasizedChannel;
  deemphasizedChannel;
  messages = {
    // Message to show when array is presented
    // but contains no values
    emptyMessage: "Loading data.",

    // Footer total message
    totalMessage: "total",

    // Footer selected message
    selectedMessage: "selected",
  };
  sorts;
  constructor(
    private widgetTypeService: WidgetTypeService,
    private widgetConnectService: WidgetConnectService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    const deemphsSub = this.widgetConnectService.deemphasizeChannel.subscribe(
      (channel) => {
        this.deemphasizedChannel = channel;
      }
    );
    const emphSub = this.widgetConnectService.emphasizedChannel.subscribe(
      (channel) => {
        const index = this.findRowIndex(channel);
        const row = this.rows[index];
        this.emphasizedChannel = channel;
        this.selectedRow = [row];
        this.table.element.querySelector(".datatable-body").scrollTop =
          index * this.table.rowHeight;
      }
    );
    this.subscription.add(emphSub);
    this.subscription.add(deemphsSub);
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // (changes.data || changes.selectedMetrics) &&
    // this.channels.length > 0 &&
    // this.selectedMetrics.length > 0
    if (
      (changes.channels || changes.data) &&
      this.channels.length > 0 &&
      this.selectedMetrics.length > 0
    ) {
      this.buildColumns();
      this.buildRows(this.data);
    }
  }

  buildColumns() {
    let name;
    let isTreeColumn;
    switch (this.properties.displayType) {
      case "channel":
        name = "Channel";
        isTreeColumn = false;
        break;
      case "stoplight":
        name = "Station";
        isTreeColumn = true;
        break;
      default:
        name = "Station";
        isTreeColumn = true;
        break;
    }

    this.columns = [
      {
        name,
        prop: "title",
        isTreeColumn,
        width: 100,
        canAutoResize: false,
        frozenLeft: true,
        resizeable: true,
        comparator: this.channelComparator.bind(this),
      },
    ];

    this.columns.push({
      name: "# out",
      prop: "agg",
      width: 45,
      canAutoResize: false,
      frozenLeft: true,
      resizeable: false,
    });
    this.sorts = [{ prop: "agg", dir: "desc" }];
    setTimeout(() => {
      this.selectedMetrics.forEach((metric) => {
        this.columns.push({
          name: metric.name,
          prop: metric.id,
          comparator: this.metricComparator.bind(this),
          width: 65,
          canAutoResize: true,
          sortable: true,
          cellTemplate: this.cellTemplate,
          headerTemplate: this.headerTemplate,
        });
      });
      this.columns = [...this.columns];
    }, 0);
  }

  resize() {
    if (this.table) {
      this.table.recalculate();
    }
  }

  private findRowIndex(nslc) {
    return this.rows.findIndex((row) => {
      return row.nslc === nslc;
    });
  }

  private metricComparator(propA, propB) {
    const result = propA.value - propB.value;
    return result;
  }

  private channelComparator(propA, propB) {
    return propA.localeCompare(propB);
  }

  private buildRows(data) {
    this.loadingChange.emit("Building chart...");
    const rows = [];
    const stations = [];
    const stationRows = [];

    this.visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
      this.selectedMetrics,
      this.thresholds,
      this.properties,
      this.dataRange,
      3
    );

    this.channels.forEach((channel) => {
      const identifier =
        channel.networkCode.toUpperCase() +
        "." +
        channel.stationCode.toUpperCase();
      const nslc = channel.nslc.toUpperCase();
      let agg = 0;
      const rowMetrics = {};
      const stationRowMetrics = {};
      this.selectedMetrics.forEach((metric) => {
        let val: number = null;
        let count;
        if (data[channel.id] && data[channel.id][metric.id]) {
          const rowData = data[channel.id][metric.id];
          val = rowData[0].value;
        }

        const visualMap = this.visualMaps[metric.id];
        const inRange = visualMap
          ? this.widgetTypeService.checkValue(val, visualMap)
          : true;
        if (val === null || (visualMap && !inRange)) {
          agg++;
          count = 0;
        } else {
          count = 1;
        }

        rowMetrics[metric.id] = {
          value: val,
          color: this.getStyle(val, visualMap),
          count: 0,
        };
        stationRowMetrics[metric.id] = {
          value: val,
          color: this.getStyle(val, visualMap),
          count, //channel in range for this metric
        };
      });
      let title;
      if (this.properties.displayType === "channel") {
        title = nslc;
      } else {
        title = channel.loc.toUpperCase() + "." + channel.code.toUpperCase();
      }

      let row = {
        title,
        id: channel.id,
        nslc: nslc,
        parentId: identifier,
        treeStatus: "disabled",
        agg,
      };
      row = { ...row, ...rowMetrics };
      rows.push(row);

      if (this.properties.displayType !== "channel") {
        let staIndex = stations.indexOf(identifier);
        if (staIndex < 0) {
          staIndex = stations.length;
          stations.push(identifier);
          const station = {
            ...{
              title: identifier,
              id: identifier,
              treeStatus: "collapsed",
              count: 0, //number of channels the station has
              agg, //number of channels/metrics out of spec
              type: this.properties.displayType,
            },
          };

          stationRows.push(station);
        }
        stationRows[staIndex] = this.findWorstChannel(
          row,
          stationRows[staIndex],
          stationRowMetrics
        );
        // check if agg if worse than current agg
      }
    });
    this.loadingChange.emit(false);
    this.rows = [...stationRows, ...rows];
  }

  //FIXME: this needs to be cleaned up
  private findWorstChannel(channel, station, stationRowMetrics) {
    station.count++;
    if (station.type === "worst") {
      if (channel.agg >= station.agg) {
        const newStation = { ...station, ...stationRowMetrics };
        newStation.treeStatus = station.treeStatus;
        newStation.id = station.id;
        newStation.parentId = null;
        return newStation;
      }
    } else if (station.type === "stoplight") {
      Object.keys(stationRowMetrics).forEach((key) => {
        if (!station[key]) {
          station[key] = { ...stationRowMetrics[key] };
        } else {
          station[key].count += stationRowMetrics[key].count;
        }

        if (station[key].count === station.count) {
          //all in
          station[key].color = this.visualMaps[key]?.colors.in;
        } else if (station[key].count > 0) {
          //some out
          station[key].color = this.visualMaps[key]?.colors.middle;
        } else if (station[key].count === 0) {
          // all out
          station[key].color = this.visualMaps[key]?.colors.out;
        }

        if (!station[key].color) {
          station[key].color = "gray";
        }
      });
    }
    return station;
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

  onSelect(event) {
    this.onTreeAction({ row: event.selected[0] });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getRowClass(row) {
    console.log(row.nslc, this.deemphasizedChannel, this.emphasizedChannel);
    const temp = {
      deemphasized: row.nslc === this.deemphasizedChannel,
      emphasized: row.nslc === this.emphasizedChannel,
    };
    return temp;
  }

  private getStyle(value, visualMap): string {
    return this.widgetTypeService.getColorFromValue(value, visualMap);
  }
}
