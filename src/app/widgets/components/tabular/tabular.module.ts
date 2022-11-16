import { NgModule } from "@angular/core";
import { NgxDatatableModule } from "@boring.devs/ngx-datatable";

import { TabularComponent } from "./tabular.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [TabularComponent],
  imports: [NgxDatatableModule, SharedModule],
  exports: [TabularComponent],
  providers: [],
})
export class TabularModule {}
