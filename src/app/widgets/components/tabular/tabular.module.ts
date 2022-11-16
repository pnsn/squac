import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgxDatatableModule } from "@boring.devs/ngx-datatable";
import { SquacapiModule } from "@squacapi/squacapi.module";
import { TabularComponent } from "./tabular.component";

@NgModule({
  declarations: [TabularComponent],
  imports: [NgxDatatableModule, SquacapiModule, CommonModule],
  exports: [TabularComponent],
  providers: [],
})
export class TabularModule {}
