import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SquacapiModule } from "@squacapi/squacapi.module";
import { NgxEchartsModule } from "ngx-echarts";
import { PrecisionPipe } from "./pipes/precision.pipe";

@NgModule({
  declarations: [PrecisionPipe],
  imports: [
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    SquacapiModule,
    CommonModule,
  ],
  providers: [],
  exports: [PrecisionPipe, NgxEchartsModule, SquacapiModule, CommonModule],
})
export class SharedModule {}
