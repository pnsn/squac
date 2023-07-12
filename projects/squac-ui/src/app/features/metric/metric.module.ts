import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { NgModule } from "@angular/core";
import { MetricComponent } from "./components/metric/metric.component";
import { MetricViewComponent } from "./components/metric-view/metric-view.component";
import { MetricEditComponent } from "./components/metric-edit/metric-edit.component";
import { MetricRoutingModule } from "./metric-routing.module";
import { MetricEditEntryComponent } from "./components/metric-edit/metric-edit-entry/metric-edit-entry.component";
import { TooltipModule } from "@ui/tooltip/tooltip.module";
import { LoadingDirective } from "@shared/directives/loading-directive.directive";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";

/** Metric module */
@NgModule({
  declarations: [
    MetricComponent,
    MetricViewComponent,
    MetricEditComponent,
    MetricEditEntryComponent,
  ],
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    SharedModule,
    MetricRoutingModule,
    TooltipModule,
    LoadingDirective,
  ],
})
export class MetricModule {}
