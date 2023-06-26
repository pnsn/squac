import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";

/**
 * Module for core imports, to be imported into main app module
 */
@NgModule({
  imports: [MatDialogModule, MatSnackBarModule],
})
export class CoreModule {}
