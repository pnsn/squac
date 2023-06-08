import { NgModule } from "@angular/core";
import { TabularComponent } from "./tabular.component";
import { SharedModule } from "../../shared/shared.module";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";

/**
 *
 */
@NgModule({
  declarations: [TabularComponent],
  imports: [MatTableModule, MatSortModule, SharedModule, MatIconModule],
  exports: [TabularComponent],
  providers: [],
})
export class TabularModule {}
