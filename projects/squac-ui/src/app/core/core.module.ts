import { NgModule } from "@angular/core";
import { NotFoundComponent } from "@core/components";
import { AuthComponent } from "@core/components/auth/auth.component";
import { HomeComponent } from "@core/components/home/home.component";
import { MenuComponent } from "@core/components/menu/menu.component";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";

/**
 * Module for core imports, to be imported into main app module
 */
@NgModule({
  imports: [MatDialogModule, MatSnackBarModule],
})
export class CoreModule {}
