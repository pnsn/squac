import { NgModule } from "@angular/core";
import { TestComponent } from "./test/test.component";
import { MaterialTestComponent } from "./material-test/test.component";
import { TestRoutingModule } from "./test-routing.module";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NgClass } from "@angular/common";

/**
 *
 */
@NgModule({
  declarations: [TestComponent, MaterialTestComponent],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCheckboxModule,
    NgClass,
    MatButtonToggleModule,
    TestRoutingModule,
  ],
})
export class TestModule {}
