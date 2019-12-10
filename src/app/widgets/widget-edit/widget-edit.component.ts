import { Component, OnInit, Output, EventEmitter, OnDestroy, Inject } from '@angular/core';
import { Route, ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { Metric } from '../../shared/metric';
import { MetricsService } from '../../shared/metrics.service';
import { WidgetsService } from '../widgets.service';
import { Widget } from '../widget';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dashboard } from 'src/app/dashboards/dashboard';
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { ChannelGroup } from 'src/app/shared/channel-group';
import { ChannelGroupsService } from 'src/app/channel-groups/channel-groups.service';

@Component({
  selector: 'app-widget-edit',
  templateUrl: './widget-edit.component.html',
  styleUrls: ['./widget-edit.component.scss']
})
export class WidgetEditComponent implements OnInit, OnDestroy {

  id: number;
  widget: Widget;
  editMode: boolean;
  widgetForm: FormGroup;
  subscriptions: Subscription = new Subscription();
  availableMetrics: Metric[];
  selectedMetrics: Metric[];
  availableChannelGroups: ChannelGroup[];
  selectedChannelGroup: ChannelGroup;
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  dashboardId: number;
  tableRows: Metric[];
  widgetTypes = [ // TODO: get from squac, this is for test
    {
      id: 1,
      type: 'tabular',
      name: 'tabular'
    },
    {
      id: 2,
      type: 'timeline',
      name: 'timeline'
    },
    {
      id: 3,
      type: 'timeseries',
      name: 'time series'
    }
  ];

  statTypes = [
    {
      "id": 1,
      "type": "ave",
      "name": "Average",
      "description": ""
    }
  ];


  rows = 3;
  columns = 6;
  x=1;
  y=1;
  constructor(
    public dialogRef: MatDialogRef<WidgetEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private widgetService: WidgetsService,
    private metricsService: MetricsService,
    private channelGroupsService: ChannelGroupsService
  ) { }

  ngOnInit() {
    this.widget = this.data.widget;
    this.dashboardId = this.data.dashboardId;
    this.editMode = !!this.widget;
    console.log(this.widget);


    this.metricsService.fetchMetrics();

    const sub1 = this.metricsService.getMetrics.subscribe(metrics => {
      this.availableMetrics = metrics;
      this.tableRows = this.availableMetrics;
      this.initForm();
    });

    this.channelGroupsService.fetchChannelGroups();
    const sub2 = this.channelGroupsService.getChannelGroups.subscribe(channelGroups => {
      this.availableChannelGroups = channelGroups;
    });

    this.subscriptions.add(sub1);
    this.subscriptions.add(sub2);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initForm() {
    this.widgetForm = new FormGroup({
      name : new FormControl('', Validators.required),
      description : new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      statType: new FormControl('', Validators.required)
    });

    this.selectedMetrics = [];

    if (this.editMode) {
      this.id = this.widget.id;
      this.selectedMetrics = this.widget.metrics;
      this.rows = this.widget.rows;
      this.columns = this.widget.columns;
      this.widgetForm.patchValue(
        {
          name : this.widget.name,
          description : this.widget.description,
          type: this.widget.typeId,
          statType: this.widget.stattype.id
        }
      );
      this.selectedChannelGroup = this.widget.channelGroup;
      const metricIds = this.widget.metricsIds;
      this.selectedMetrics = this.availableMetrics.filter(
        metric => {
          return metricIds.indexOf(metric.id) >= 0;
        }
      );
    }


  }

  getChannelsForChannelGroup(group) {
    this.selectedChannelGroup = group;
    console.log(group);

    if (this.selectedChannelGroup.id) {
      const channelGroupsSub = this.channelGroupsService.getChannelGroup(this.selectedChannelGroup.id).subscribe(
        channelGroup => {
          this.selectedChannelGroup = channelGroup;
        }
      );

      this.subscriptions.add(channelGroupsSub);
    }

  }

  metricsSelected({selected}) {
    this.selectedMetrics.splice(0, this.selectedMetrics.length);
    this.selectedMetrics.push(...selected);
    // this.selectedMetrics = event;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.availableMetrics.filter((d) => {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.tableRows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }


  save() {
    console.log(this.selectedMetrics);
    const values = this.widgetForm.value;
    const newWidget = new Widget(
      this.id,
      values.name,
      values.description,
      values.type,
      this.dashboardId,
      this.selectedChannelGroup.id,
      this.widget ? this.widget.columns : this.columns,
      this.widget ? this.widget.columns : this.rows,
      this.widget ? this.widget.x : this.x,
      this.widget ? this.widget.y: this.y,
      this.selectedMetrics
    );

    newWidget.stattype = this.statTypes.find((st) => {
      return st.id === values.statType;
    });;
    this.widgetService.updateWidget(
      newWidget
    ).subscribe(
      result => {
        this.dialogRef.close(result);
      }
    );
  }

  cancel() {
    this.dialogRef.close();
  }
}
