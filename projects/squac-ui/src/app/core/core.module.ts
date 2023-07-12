import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";

/**
 * Module for core imports, to be imported into main app module
 */
@NgModule({
  imports: [MatDialogModule, MatSnackBarModule, NgxDaterangepickerMd.forRoot()],
})
export class CoreModule {}
