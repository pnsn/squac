import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { NgModule } from "@angular/core";
import { MetricComponent } from "./components/metric/metric.component";
import { MetricViewComponent } from "./components/metric-view/metric-view.component";
import { MetricEditComponent } from "./components/metric-edit/metric-edit.component";
import { MetricRoutingModule } from "./metric-routing.module";
import { MetricEditEntryComponent } from "./components/metric-edit/metric-edit-entry/metric-edit-entry.component";

@NgModule({
  declarations: [
    MetricComponent,
    MetricViewComponent,
    MetricEditComponent,
    MetricEditEntryComponent,
  ],
  imports: [CommonModule, SharedModule, MetricRoutingModule],
})
export class MetricModule {}
