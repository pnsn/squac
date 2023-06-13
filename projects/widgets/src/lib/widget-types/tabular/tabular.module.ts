import { NgModule } from "@angular/core";
import { TabularComponent } from "./tabular.component";
import { SharedModule } from "../../shared/shared.module";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltip, MatTooltipModule } from "@angular/material/tooltip";

/**
 *
 */
@NgModule({
  declarations: [TabularComponent],
  imports: [
    MatTableModule,
    MatSortModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  exports: [TabularComponent],
  providers: [],
})
export class TabularModule {}
