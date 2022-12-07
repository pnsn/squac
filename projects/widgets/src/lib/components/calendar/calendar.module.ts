import { NgModule } from "@angular/core";

import { NgxEchartsModule } from "ngx-echarts";
import { CalendarComponent } from "./calendar.component";
import { SharedModule } from "../../shared/shared.module";

/**
 *
 */
@NgModule({
  declarations: [CalendarComponent],
  imports: [NgxEchartsModule, SharedModule],
  exports: [CalendarComponent],
  providers: [],
})
export class CalendarModule {}
