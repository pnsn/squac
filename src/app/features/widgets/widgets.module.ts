import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetDetailComponent } from './components/widget-detail/widget-detail.component';
import { WidgetEditComponent } from './components/widget-edit/widget-edit.component';
import { MeasurementPipe } from './pipes/measurement.pipe';
import { TabularComponent } from './components/widget-types/tabular/tabular.component';
import { TimelineComponent } from './components/widget-types/timeline/timeline.component';
import { TimeseriesComponent } from './components/widget-types/timeseries/timeseries.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GridsterModule } from 'angular-gridster2';
import { ThresholdEditComponent } from './components/widget-edit/threshold-edit/threshold-edit.component';
import { MetricsEditComponent } from './components/widget-edit/metrics-edit/metrics-edit.component';
import { ChannelGroupsEditComponent } from './components/widget-edit/channel-groups-edit/channel-groups-edit.component';
import { SharedModule } from '@shared/shared.module';
import { WidgetsComponent } from './components/widgets/widgets.component';
import { WidgetEditEntryComponent } from './components/widget-edit/widget-edit-entry/widget-edit-entry.component';
import { MapComponent } from './components/widget-types/map/map.component';


@NgModule({
  declarations: [
    WidgetsComponent,
    WidgetDetailComponent,
    WidgetEditComponent,
    TabularComponent,
    TimelineComponent,
    TimeseriesComponent,
    ThresholdEditComponent,
    MeasurementPipe,
    MetricsEditComponent,
    ChannelGroupsEditComponent,
    WidgetEditEntryComponent,
    MapComponent
  ],
  imports: [
    SharedModule,
    NgxChartsModule,
    GridsterModule
  ]
})
export class WidgetsModule { }
