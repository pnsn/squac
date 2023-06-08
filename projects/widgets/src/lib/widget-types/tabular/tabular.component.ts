import {
  Component,
  ViewChild,
  OnDestroy,
  OnInit,
  NgZone,
  ChangeDetectorRef,
} from "@angular/core";
import {
  WidgetConnectService,
  WidgetManagerService,
  WidgetConfigService,
} from "../../services";
import {
  ProcessedData,
  StoplightVisualMapOption,
  VisualMapTypes,
  WidgetTypeComponent,
} from "../../interfaces";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { GenericWidgetComponent } from "../../shared/components";
import { Row } from "./types";
import { Channel, MeasurementPipe } from "squacapi";
import { MatSort } from "@angular/material/sort";
import { MatLegacyTableDataSource as MatTableDataSource } from "@angular/material/legacy-table";
import { SelectionModel } from "@angular/cdk/collections";

/**
 * Table based widget
 */
@Component({
  selector: "widget-tabular",
  templateUrl: "./tabular.component.html",
  styleUrls: ["./tabular.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class TabularComponent
  extends GenericWidgetComponent
  implements OnInit, OnDestroy, WidgetTypeComponent
{
  /** nslc of currently emphasized channel */
  emphasizedChannel: string;
  /** nslc of channel to deemphasize */
  deemphasizedChannel: string;
  /** table rows */
  rows = [];
  /** table columns */
  columns = [];
  /** currently selected rows */
  selectedRow = [];
  /** pipe for transforming measurements */
  measurementPipe = new MeasurementPipe();

  /** Mat sort directive, used to enable sorting on */
  @ViewChild(MatSort) sort: MatSort;
  /** columns shown in table */
  metricColumns: string[] = ["title", "agg"];
  /** alert table data source */
  dataSource: MatTableDataSource<Row> = new MatTableDataSource([]);
  /** selection on alert table */
  selection: SelectionModel<Row> = new SelectionModel(true, []);

  expandedElement: Row | null;

  /** true if table should use nested rows for stations and channels */
  useStationView = false;

  constructor(
    private widgetConfigService: WidgetConfigService,
    protected widgetConnectService: WidgetConnectService,
    override widgetManager: WidgetManagerService,
    override ngZone: NgZone,
    override cdr: ChangeDetectorRef
  ) {
    super(widgetManager, widgetConnectService, ngZone);
  }

  /**
   * Init
   */
  override ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (
      data: Row,
      sortHeaderId: string
    ): string | number => {
      const dataItem = data[sortHeaderId];
      if (dataItem) {
        return dataItem;
      } else {
        return data.metrics[sortHeaderId]?.value;
      }
    };

    //override sort to allow child rows to stay with parent
    this.dataSource.sortData = (data: Row[], sort: MatSort): Row[] => {
      if (!sort.active || sort.direction === "") {
        return data;
      }

      // actively sorted column
      const active = sort.active;
      // sort direction
      const direction = sort.direction;

      // keep children grouped to parent

      // less than 0 if A is first, more than 0 if B is first
      return data.sort((a: Row, b: Row) => {
        let comparatorResult = 0;

        // b is directly behind parent
        if (b.parentId && !a.parentId) {
          return a.title.localeCompare(b.parentId);
        } else if (a.parentId && !b.parentId) {
          return b.title.localeCompare(a.parentId);
        }
        switch (sort.active) {
          case "title":
            comparatorResult = a.title.localeCompare(b.title);
            break;
          case "agg":
            comparatorResult = a.agg - b.agg;
            break;
          default:
            //keep no data values at the bottom
            if (a.metrics[active].value === null) return 1;
            if (b.metrics[active].value === null) return -1;
            comparatorResult =
              a.metrics[active].value - b.metrics[active].value;
            break;
        }
        return comparatorResult * (direction == "asc" ? 1 : -1);
      });
    };
    this.subscription.add(
      this.widgetManager.resize$.subscribe(this.resize.bind(this))
    );
    super.ngOnInit();
  }

  /**
   * override to disable
   *
   * @param _useDenseView unused
   */
  override useDenseView(_useDenseView: boolean): void {
    return;
  }

  /**
   * Disabled zoom
   */
  startZoom(): void {
    return;
  }

  /**
   * Disabled toggle key
   */
  toggleKey(): void {
    return;
  }

  /**
   * @override
   */
  changeMetrics(): void {
    this.dataSource.data = this.rows;
    if (this.useStationView) {
      this.metricColumns.splice(0, 0, "expand");
    }
    this.columns = [
      ...this.metricColumns,
      ...this.selectedMetrics.map((metric) => metric.code), //has to be string
    ];
  }

  /**
   * @override
   */
  deemphasizeChannel(channel: string): void {
    this.deemphasizedChannel = channel;
  }

  /**
   * @override
   */
  emphasizeChannel(channel: string): void {
    const index = this.findRowIndex(channel);
    const row = this.rows[index];
    this.emphasizedChannel = channel;
    this.selectedRow = [row];
    // this.table.element.querySelector(".datatable-body").scrollTop =
    //   index * (this.table.rowHeight as number);
  }

  /**
   * disabled
   */
  configureChart(): void {
    return;
  }

  /**
   * redraw table on resize
   */
  resize(): void {
    // if (this.table) {
    //   this.table.recalculate();
    // }
  }

  /**
   * Finds index of row that has matching nslc
   *
   * @param nslc - channel nslc to find
   * @returns index of row
   */
  private findRowIndex(nslc: string): number {
    return this.rows.findIndex((row) => {
      return row.nslc === nslc;
    });
  }

  /**
   * Inserts child rows into a table if the row has children
   *
   * @param row row to expand
   */
  expandRow(row: Row): void {
    const data = [...this.rows];
    //if this row is already expanded, close it
    // if no children, ignore row and close others
    if (row === this.expandedElement || !row.children) {
      this.dataSource.data = this.rows;
      this.expandedElement = null;
      return;
    }

    const rowIndex = data.findIndex((item) => row.title === item.title);
    //splice children into data
    if (rowIndex > -1 && row.children) {
      data.splice(rowIndex + 1, 0, ...row.children);
    }

    this.dataSource.data = data;
    this.expandedElement = row;

    // if this row is not currentl expanded, insert child rows )

    // expandedElement = expandedElement === row ? null : row
  }

  /**
   * @override
   */
  buildChartData(data: ProcessedData): Promise<void> {
    return new Promise<void>((resolve) => {
      const rows = [];
      const stationRowsMap = new Map<string, Row>();

      // true if group channels by station
      this.useStationView =
        this.properties.displayType === "stoplight" ||
        this.properties.displayType === "worst";

      this.visualMaps = this.widgetConfigService.getVisualMapFromThresholds(
        this.selectedMetrics,
        this.properties,
        3
      );

      this.channels.forEach((channel: Channel) => {
        const stationId = channel.staCode;
        const nslc = channel.nslc;
        const channelRow: Row = {
          title: this.useStationView ? `${channel.loc}.${channel.code}` : nslc,
          metrics: {},
          agg: 0,
        };

        let stationRow;
        // add station row that will expand to show channels
        if (this.useStationView) {
          channelRow.parentId = stationId;
          if (!stationRowsMap.has(stationId)) {
            const stationRow: Row = {
              title: stationId,
              children: [],
              metrics: null,
              agg: 0,
              channelAgg: null,
            };
            stationRowsMap.set(stationId, stationRow);
          }
          stationRow = stationRowsMap.get(stationId);
        }

        this.selectedMetrics.forEach((metric) => {
          if (!metric) return;
          let value: number = null; //column value

          if (data.get(channel.id)) {
            const rowData = data.get(channel.id).get(metric.id);
            value = this.measurementPipe.transform(
              rowData,
              this.widgetManager.stat
            );
          }

          const visualMap = this.visualMaps[metric.id];
          const inRange = visualMap
            ? this.widgetConfigService.checkValue(value, visualMap)
            : true;

          // metric is in spec if the value exists and is in Range
          const inSpec = value !== null && visualMap && inRange;

          // display color for channel
          const color = this.getStyle(value, visualMap);

          // add metric data to channel row
          channelRow.metrics[metric.code] = {
            value,
            color,
            inSpec,
          };
          if (!inSpec) {
            channelRow.agg++;
          }
          if (this.properties.displayType === "stoplight" && visualMap) {
            if (!stationRow.metrics) stationRow.metrics = {};
            this.stationStoplight(
              metric.code,
              inSpec,
              stationRow,
              visualMap as StoplightVisualMapOption
            );
          }
        });

        if (stationRow) {
          if (channelRow.agg > 0) {
            stationRow.agg++;
          }
          if (this.properties.displayType === "worst") {
            if (!stationRow.metrics || channelRow.agg > stationRow.channelAgg) {
              stationRow.metrics = channelRow.metrics;
              stationRow.channelAgg = channelRow.agg;
            }
          }
          stationRow.children.push(channelRow);
        } else {
          rows.push(channelRow);
        }
      });
      if (stationRowsMap.size > 0) {
        this.rows = [...stationRowsMap.values()];
      } else {
        this.rows = [...rows];
      }
      resolve();
    });
  }

  /**
   * Calculates properties for the station row for a single metric
   * with the stoplight type
   *
   * @param code metric identifying code
   * @param inSpec is channel in spec for this metric
   * @param stationRow station row for the channel
   * @param visualMap visual map for metric
   */
  private stationStoplight(
    code: string,
    inSpec: boolean,
    stationRow: Row,
    visualMap: StoplightVisualMapOption
  ): void {
    if (!stationRow.metrics[code]) {
      stationRow.metrics[code] = {
        value: 0,
        color: null,
        inSpec,
      };
    }

    const stationMetric = stationRow.metrics[code];
    if (!inSpec) {
      stationMetric.value++;
    }
    // number of out of spec channels already
    const numOutOfSpec = stationMetric.value;
    // add 1 because current channel hasn't been added yet
    const totalNumChannels = stationRow.children.length + 1;
    let color;
    if (totalNumChannels > numOutOfSpec) {
      //some out of spec
      color = visualMap.colors.middle;
    } else if (totalNumChannels === numOutOfSpec) {
      //all out of spec
      color = visualMap.colors.out;
    } else if (numOutOfSpec === 0) {
      // all in spec
      color = visualMap.colors.in;
    } else {
      // something got messed up
      color = "gray";
    }
    stationMetric.color = color;
  }

  /**
   * Finds color for value from visualmap
   *
   * @param value - value to check
   * @param visualMap - visual map
   * @returns color string
   */
  private getStyle(value: number, visualMap: VisualMapTypes): string {
    return this.widgetConfigService.getColorFromValue(value, visualMap);
  }
}
