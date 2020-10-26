import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Widget } from '@features/widgets/models/widget';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WidgetEditService } from '../../services/widget-edit.service';
import { Metric } from '@core/models/metric';
import { ChannelGroup } from '@core/models/channel-group';

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
  metrics: Metric[];
  channelGroups: ChannelGroup[];

  // TODO: Get this from SQUAC
  widgetTypes =
  [
      {
          id: 1,
          name: 'tabular',
          type: 'tabular',
          description: 'Table of measurement values displayed with a single value calculated with the stat type.'
      },
      {
          id: 2,
          name: 'timeline',
          type: 'timeline',
          description: 'Timeline of measurement data for a single metric displayed with values \'in\' or \'out\' of set threshold values.'
      },
      {
          id: 3,
          name: 'time series',
          type: 'timeseries',
          description: 'Time chart of measurement values for a single metric.'
      },
      {
          id: 4,
          name: 'Map',
          type: 'map',
          description: 'A map of channels represented by values for measurements calculated with stattype.'
      }
  ];

  statTypes;

  selectedType: number;

  isValid: boolean;

  constructor(
    public dialogRef: MatDialogRef<WidgetEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private widgetEditService: WidgetEditService,
  ) { }
  ngOnInit() {
    this.widget = this.data.widget ? this.data.widget : null;
    this.statTypes = this.data.statTypes;
    this.metrics = this.data.metrics;
    this.channelGroups = this.data.channelGroups;

    const sub = this.widgetEditService.isValid.subscribe(
      valid => {
        this.isValid = valid;
      }, error => {
        console.log('error in widget edit valid: ' + error);
      }
    );

    this.widgetEditService.setWidget(this.widget);

    this.dashboardId = this.data.dashboardId;
    this.editMode = !!this.widget;
    this.initForm();

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
    this.selectedType = type;
    this.widgetEditService.updateType(type);
  }

  save() {
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

    this.widgetEditService.saveWidget().subscribe(
      () => {
        this.cancel();
      }
    );
  }

  cancel(widget?: Widget) {
    this.widgetEditService.clearWidget();
    this.dialogRef.close(widget);
  }
}
