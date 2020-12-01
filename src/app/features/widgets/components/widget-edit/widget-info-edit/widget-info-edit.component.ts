import { AfterViewInit, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Widget } from '@features/widgets/models/widget';
import { WidgetEditService } from '@features/widgets/services/widget-edit.service';

@Component({
  selector: 'app-widget-info-edit',
  templateUrl: './widget-info-edit.component.html',
  styleUrls: ['./widget-info-edit.component.scss']
})
export class WidgetInfoEditComponent implements OnInit, AfterViewInit{
  @Input() widget: Widget;
  @Input() statTypes;
  editMode: boolean;
  widgetForm: FormGroup;

  id;
  selectedType;
  error : string = "Missing widget name";
  done: boolean = false;
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


  constructor(
    private widgetEditService: WidgetEditService
  ) { }

  ngOnInit(): void {

    this.editMode = !!this.widget;

    this.widgetForm = new FormGroup({
      name : new FormControl('', Validators.required),
      statType: new FormControl(13, Validators.required) // default is raw data
    });
    this.initForm();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.checkValid();
  }


  getStatTypeById(id) {
    return this.widgetTypes.find(type => type.id === id);
  }
  private initForm() {


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
    this.checkValid();
  }

  checkValid() {
    this.done = !!this.widgetForm && this.widgetForm.valid && !!this.selectedType;
    if(!this.done) {
      if(this.widgetForm && !this.widgetForm.valid) {
        this.error = "Missing widget name";
      } else if(!this.selectedType) {
        this.error = "Missing widget type";
      } else {
        this.error = "Missing widget info";
      }
    }
  }

  updateInfo() {
    const values = this.widgetForm.value;
    const statType = this.statTypes.find((st) => {
      return st.id === values.statType;
    });
    this.widgetEditService.updateWidgetInfo(
      values.name,
       '',
      statType
    );

  }
}
