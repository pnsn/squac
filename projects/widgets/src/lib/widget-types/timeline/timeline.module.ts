import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { TimelineComponent } from "./timeline.component";

/**
 *
 */
@NgModule({
  declarations: [TimelineComponent],
  imports: [SharedModule],
  exports: [TimelineComponent],
  providers: [],
})
export class TimelineModule {}
