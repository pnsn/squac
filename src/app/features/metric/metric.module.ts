import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { NgModule } from "@angular/core";
import { MetricComponent } from "./components/metric/metric.component";
import { MetricDetailComponent } from "./components/metric-detail/metric-detail.component";
import { MetricViewComponent } from "./components/metric-view/metric-view.component";
import { MetricEditComponent } from "./components/metric-edit/metric-edit.component";
import { MetricRoutingModule } from "./metric-routing.module";
@NgModule({
  declarations: [
    MetricComponent,
    MetricDetailComponent,
    MetricViewComponent,
    MetricEditComponent,
  ],
  imports: [CommonModule, SharedModule, MetricRoutingModule],
})
export class MetricModule {}
