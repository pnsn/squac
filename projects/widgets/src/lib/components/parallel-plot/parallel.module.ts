import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";

import { NgxEchartsModule } from "ngx-echarts";
import { ParallelPlotComponent } from "./parallel-plot.component";

@NgModule({
  declarations: [ParallelPlotComponent],
  imports: [NgxEchartsModule, SharedModule],
  exports: [ParallelPlotComponent],
  providers: [],
})
export class ParallelModule {}
