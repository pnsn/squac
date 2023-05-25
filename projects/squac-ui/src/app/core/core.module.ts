import { NgModule } from "@angular/core";
import { NotFoundComponent } from "@core/components";
import { SharedModule } from "@shared/shared.module";
import { AuthComponent } from "@core/components/auth/auth.component";
import { HomeComponent } from "@core/components/home/home.component";
import { MenuComponent } from "@core/components/menu/menu.component";
import { CommonModule } from "@angular/common";

/**
 * Module for core imports, to be imported into main app module
 */
@NgModule({
  declarations: [
    AuthComponent,
    NotFoundComponent,
    HomeComponent,
    MenuComponent,
  ],
  imports: [SharedModule, CommonModule],
})
export class CoreModule {}
