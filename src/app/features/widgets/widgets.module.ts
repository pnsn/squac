import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetComponent } from './components/widget.component';
import { WidgetDetailComponent } from './components/widget-detail/widget-detail.component';
import { WidgetEditComponent } from './components/widget-edit/widget-edit.component';
import { MeasurementPipe } from './pipes/measurement.pipe';
import { TabularComponent } from './components/widget-detail/widget-types/tabular/tabular.component';
import { TimelineComponent } from './components/widget-detail/widget-types/timeline/timeline.component';
import { TimeseriesComponent } from './components/widget-detail/widget-types/timeseries/timeseries.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GridsterModule } from 'angular-gridster2';
import { ThresholdEditComponent } from './components/widget-edit/threshold-edit/threshold-edit.component';
import { MetricsEditComponent } from './components/widget-edit/metrics-edit/metrics-edit.component';
import { ChannelGroupsEditComponent } from './components/widget-edit/channel-groups-edit/channel-groups-edit.component';
import { AbilityModule } from '@casl/angular';
import { SharedModule } from '@shared/shared.module';


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
