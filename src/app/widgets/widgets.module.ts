import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetComponent } from './widget.component';
import { WidgetDetailComponent } from './widget-detail/widget-detail.component';
import { WidgetEditComponent } from './widget-edit/widget-edit.component';
import { MeasurementPipe } from './measurement.pipe';
import { TabularComponent } from './widget-detail/widget-types/tabular/tabular.component';
import { TimelineComponent } from './widget-detail/widget-types/timeline/timeline.component';
import { TimeseriesComponent } from './widget-detail/widget-types/timeseries/timeseries.component';
import { SharedModule } from '../shared/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GridsterModule } from 'angular-gridster2';
import { ThresholdEditComponent } from './widget-edit/threshold-edit/threshold-edit.component';
import { MetricsEditComponent } from './widget-edit/metrics-edit/metrics-edit.component';
import { ChannelGroupsEditComponent } from './widget-edit/channel-groups-edit/channel-groups-edit.component';
import { AbilityModule } from '@casl/angular';


@NgModule({
  declarations: [
    WidgetComponent,
    WidgetDetailComponent,
    WidgetEditComponent,
    TabularComponent,
    TimelineComponent,
    TimeseriesComponent,
    ThresholdEditComponent,
    MeasurementPipe,
    MetricsEditComponent,
    ChannelGroupsEditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxChartsModule,
    GridsterModule,
    AbilityModule
  ],
  exports: [
    WidgetComponent,
    SharedModule,
    WidgetEditComponent
  ],
  entryComponents: [
    MetricsEditComponent,
    ThresholdEditComponent
  ]
})
export class WidgetsModule { }
