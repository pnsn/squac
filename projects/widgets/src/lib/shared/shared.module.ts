import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SquacapiModule } from "squacapi";
import { NgxEchartsModule } from "ngx-echarts";
import { PrecisionPipe } from "./pipes/precision.pipe";
import { GuardTypePipe } from "./pipes/guard-type.pipe";

@NgModule({
  declarations: [PrecisionPipe, GuardTypePipe],
  imports: [
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    SquacapiModule,
    CommonModule,
  ],
  providers: [],
  exports: [
    PrecisionPipe,
    GuardTypePipe,
    NgxEchartsModule,
    SquacapiModule,
    CommonModule,
  ],
})
export class SharedModule {}
