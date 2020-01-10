import { Component, OnInit, Output, EventEmitter, OnDestroy, Inject } from '@angular/core';
import { Route, ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, Subject, merge } from 'rxjs';
import { Metric } from '../../shared/metric';
import { MetricsService } from '../../shared/metrics.service';
import { WidgetsService } from '../widgets.service';
import { Widget } from '../widget';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { ChannelGroup } from 'src/app/shared/channel-group';
import { ChannelGroupsService } from 'src/app/channel-groups/channel-groups.service';
import { Threshold } from '../threshold';
import { ThresholdsService } from '../thresholds.service';
import { WidgetEditService } from './widget-edit.service';
import { mergeMap } from 'rxjs/operators';

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
      id: 1,
      type: 'ave',
      name: 'Average',
      description: ''
    }
  ];

  selectedType : number;



  constructor(
    public dialogRef: MatDialogRef<WidgetEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private widgetService: WidgetsService,
    private metricsService: MetricsService,
    private thresholdService: ThresholdsService,
    private channelGroupsService: ChannelGroupsService,
    private widgetEditService: WidgetEditService,
  ) { }

  ngOnInit() {
    this.widget = this.data.widget ? this.data.widget : null;

    this.widgetEditService.setWidget(this.widget);
    this.dashboardId = this.data.dashboardId;
    this.editMode = !!this.widget;
    console.log(this.widget);
    this.initForm()

    this.metricsService.fetchMetrics();
    this.channelGroupsService.fetchChannelGroups();

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initForm() {
    this.widgetForm = new FormGroup({
      name : new FormControl('', Validators.required),
      statType: new FormControl('', Validators.required)
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
    this.selectedType = type;
  }



  save() {
    console.log("save");
  //   //save thresholds
    const values = this.widgetForm.value;
    const statType = this.statTypes.find((st) => {
      return st.id === values.statType;
    });
    this.widgetEditService.updateWidgetInfo(
      values.name,
       "",
      this.selectedType,
      this.dashboardId,
      statType.id
    );

    let newWidget = this.widgetEditService.getWidget();


    this.widgetService.updateWidget(
      newWidget
    ).pipe(
      mergeMap(
        response => {
          return this.thresholdService.updateThresholds(
            newWidget.metrics,
            newWidget.thresholds,
            response.id
          )
        }
      )
    ).subscribe(
      result => {
        console.log(result);
      }
    );

    // const thresholdObs = 
    
    // const services = merge(
    //   ...[widgetObs, ...thresholdObs]
    // );

    // let count = 0;
    // let widget;

    //TODO: can it actually save the threshold if there's no widget ID?
    
    // services.subscribe(
    //   result => {
    //     count++;
    //     if(result.channel_group) {
    //       widget = result;
    //     }
    //     if(count === thresholdObs.length && widget) {
    //       this.dialogRef.close(widget);
    //     } 
    //   }
    // );
      console.log(newWidget)
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
