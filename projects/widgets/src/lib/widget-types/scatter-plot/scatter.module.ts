import { NgModule } from "@angular/core";

import { SharedModule } from "../../shared/shared.module";

import { NgxEchartsModule } from "ngx-echarts";
import { ScatterPlotComponent } from "./scatter-plot.component";

/**
 *
 */
@NgModule({
  declarations: [ScatterPlotComponent],
  imports: [NgxEchartsModule, SharedModule],
  exports: [ScatterPlotComponent],
  providers: [],
})
export class ScatterModule {}
