import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { NgModule } from "@angular/core";
import { MetricComponent } from "./pages/main/metric.component";
import { MetricViewComponent } from "./pages/list/metric-view.component";
import { MetricEditComponent } from "./components/metric-edit/metric-edit.component";
import { MetricRoutingModule } from "./metric-routing.module";
import { MetricEditEntryComponent } from "./pages/edit/metric-edit-entry.component";
import { LoadingDirective } from "@shared/directives/loading-directive.directive";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { TooltipDirective } from "@shared/directives/tooltip.directive";

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
    TooltipDirective,
    LoadingDirective,
  ],
})
export class MetricModule {}
