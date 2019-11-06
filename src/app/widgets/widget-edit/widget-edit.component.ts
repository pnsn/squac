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

@Component({
  selector: 'app-widget-edit',
  templateUrl: './widget-edit.component.html',
  styleUrls: ['./widget-edit.component.scss']
})
export class WidgetEditComponent implements OnInit, OnDestroy{
  id: number;
  widget: Widget;
  editMode: boolean;
  widgetForm: FormGroup;
  subscriptions: Subscription = new Subscription();
  availableMetrics: Metric[];
  selectedMetrics: Metric[];
  dashboardId: number;
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

  calcMethods = [
    'average',
    'median',
    'max',
    'min',
    'raw'
  ];


  rows = 3;
  columns = 6;
  constructor(
    public dialogRef: MatDialogRef<WidgetEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private widgetService: WidgetsService,
    private metricsService: MetricsService
  ) { }

  ngOnInit() {
    this.widget = this.data.widget;
    this.dashboardId = this.data.dashboardId;
    this.editMode = !!this.widget;
    console.log(this.widget);
    this.initForm();

    this.metricsService.fetchMetrics();

    const sub1 = this.metricsService.getMetrics.subscribe(metrics => {
      this.availableMetrics = metrics;
    });
    this.subscriptions.add(sub1);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initForm() {
    this.widgetForm = new FormGroup({
      name : new FormControl('', Validators.required),
      description : new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      method: new FormControl('', Validators.required),
      metrics: new FormControl([], Validators.required)
    });

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
          metrics : this.widget.metrics
        }
      );
    }


  }

  updateMetrics() {
    this.selectedMetrics = this.widgetForm.value.metrics;
  }

  save() {
    console.log(this.selectedMetrics)
    const values = this.widgetForm.value;
    const newWidget = new Widget(
      this.id,
      values.name,
      values.description,
      values.type,
      this.dashboardId,
      this.widget? this.widget.x : this.columns,
      this.widget? this.widget.y : this.rows,
      1,
      this.selectedMetrics
    );

    this.widgetService.updateWidget(
      newWidget
    ).subscribe(
      result => {
        if(result.id) {
          newWidget.id = result.id;
          this.dialogRef.close(newWidget);
        }

      }
    );
  }

  cancel() {
    this.dialogRef.close();
  }
}
