import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Metric } from '../../../../shared/metric';
import { MetricsService } from '../../../../shared/metrics.service';
import { WidgetsService } from '../../../widgets.service';
import { Widget } from '../../../widget';

@Component({
  selector: 'app-widget-edit',
  templateUrl: './widget-edit.component.html',
  styleUrls: ['./widget-edit.component.scss']
})
export class WidgetEditComponent implements OnInit {
  id: number;
  editMode: boolean;
  widget: Widget;
  widgetForm: FormGroup;
  subscriptions: Subscription = new Subscription();
  availableMetrics: Metric[];
  selectedMetrics: Metric[];
  dashboardId: number;
  widgetTypes = [ // TODO: get from squac, this is for test
    {
      id: 1,
      type: 'tabular'
    },
    {
      id: 1,
      type: 'some chart'
    }
  ];
  calcMethods = [
    'average',
    'median',
    'max',
    'min'
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private widgetService: WidgetsService,
    private metricsService: MetricsService
  ) { }

  ngOnInit() {
    const paramsSub = this.route.params.subscribe(
      (params: Params) => {
        console.log(params);
        this.id = +params.widgetid;
        this.editMode = params.widgetid != null;

        this.initForm();
      }
    );

    const idSub = this.route.parent.parent.params.subscribe(params => {
      this.dashboardId = +params.id;
    });

    this.metricsService.fetchMetrics();

    const sub1 = this.metricsService.getMetrics.subscribe(metrics => {
      this.availableMetrics = metrics;
    });
    this.subscriptions.add(idSub);
    this.subscriptions.add(paramsSub);
    this.subscriptions.add(sub1);
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
      const widgetSub = this.widgetService.getWidget(this.id).subscribe(
        widget => {
          this.widget = widget;
          this.selectedMetrics = widget.metrics;
          this.widgetForm.patchValue(
            {
              name : widget.name,
              description : widget.description,
              type: widget.typeId,
              metrics : widget.metrics
            }
          );
        }
      );
      this.subscriptions.add(widgetSub);
    }


  }

  updateMetrics() {
    this.selectedMetrics = this.widgetForm.value.metrics;
  }

  save() {
    const values = this.widgetForm.value;
    this.widgetService.updateWidget(
      new Widget(
        this.id,
        values.name,
        values.description,
        values.type,
        this.dashboardId,
        this.selectedMetrics
      )
    ).subscribe(
      result => {
        this.cancel();
      }
    );
    this.cancel();
  }

  cancel() {
    if (this.editMode) {
      this.router.navigate(['../../../'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../../'], {relativeTo: this.route});
    }

  }
}
