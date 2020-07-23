import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, merge } from 'rxjs';
import { WidgetsService } from '../../services/widgets.service';
import { Widget } from '@core/models/widget';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChannelGroupsService } from '@features/channel-groups/services/channel-groups.service';
import { ThresholdsService } from '../../services/thresholds.service';
import { WidgetEditService } from './widget-edit.service';
import { StatTypeService } from '@core/services/stattype.service';
import { MetricsService } from '@features/metrics/services/metrics.service';

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
  dashboardId: number;

  widgetTypes = [ // TODO: get from squac, this is for test
    {
      id: 1,
      type: 'tabular',
      name: 'tabular',
      description: 'tabular descriptioon'
    },
    {
      id: 2,
      type: 'timeline',
      name: 'timeline',
      description: 'timeline descriptioon'
    },
    {
      id: 3,
      type: 'timeseries',
      name: 'time series',
      description: 'timeseries descriptioon'
    }
  ];

  statTypes;

  selectedType: number;

  isValid: boolean;

  constructor(
    public dialogRef: MatDialogRef<WidgetEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private widgetService: WidgetsService,
    private metricsService: MetricsService,
    private thresholdService: ThresholdsService,
    private channelGroupsService: ChannelGroupsService,
    private widgetEditService: WidgetEditService,
    private statTypeService: StatTypeService
  ) { }

  ngOnInit() {
    this.widget = this.data.widget ? this.data.widget : null;
    const sub = this.widgetEditService.isValid.subscribe(
      valid => {
        this.isValid = valid;
      }, error => {
        console.log('error in widget edit valid: ' + error);
      }
    );

    this.statTypeService.statTypes.subscribe(
      statTypes => {
        this.statTypes = statTypes;
      },
      error => {
        console.log('error in stattype ' + error);
      }
    );
    this.widgetEditService.setWidget(this.widget);

    this.dashboardId = this.data.dashboardId;
    this.editMode = !!this.widget;
    console.log('widget', this.widget);
    this.initForm();

    this.metricsService.fetchMetrics();
    this.channelGroupsService.fetchChannelGroups();

    this.subscriptions.add(sub);
  }

  getStatTypeById(id) {
    return this.widgetTypes.find(type => type.id === id);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initForm() {
    this.widgetForm = new FormGroup({
      name : new FormControl('', Validators.required),
      statType: new FormControl(13, Validators.required) // default is raw data
    });



    if (this.editMode) {
      this.id = this.widget.id;
      this.widgetForm.patchValue(
        {
          name : this.widget.name,
          statType: this.widget.stattype.id
        }
      );
      this.selectedType = this.widget.typeId;

    }
  }

  selectType(type) {
    console.log(type);
    this.selectedType = type;
    this.widgetEditService.updateType(type);
  }

  save() {
    console.log('save');
  //   //save thresholds
    const values = this.widgetForm.value;
    const statType = this.statTypes.find((st) => {
      return st.id === values.statType;
    });
    this.widgetEditService.updateWidgetInfo(
      values.name,
       '',
      this.dashboardId,
      statType
    );

    const newWidget = this.widgetEditService.getWidget();

    let widget;

    this.widgetService.updateWidget(
      newWidget
    ).subscribe(
      response => {
        widget = response;

        const thresholdObs = this.thresholdService.updateThresholds(
            newWidget.metrics,
            newWidget.thresholds,
            widget.id
          );
        let count = 0;
        if (thresholdObs && thresholdObs.length > 0) {
            merge(...thresholdObs).subscribe(
              result => {
                count++;
                if (widget && count === thresholdObs.length) {
                  this.cancel(widget);
                }

              }, error => {
                console.log('error in widget edit threshold: ' + error);
              }
            );
          } else {
            this.cancel(widget);
          }
      }, error => {
        console.log('error in widget edit update: ' + error);
      }
    );
  }

  cancel(widget?: Widget) {
    if (widget) {
      this.dialogRef.close(widget);
    } else {
      this.dialogRef.close(null);
    }

  }
}
