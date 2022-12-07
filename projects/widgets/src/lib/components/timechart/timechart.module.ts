import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { TimechartComponent } from "./timechart.component";

/**
 * Time chart module
 */
@NgModule({
  declarations: [TimechartComponent],
  imports: [SharedModule],
  exports: [TimechartComponent],
  providers: [],
})
export class TimechartModule {}
