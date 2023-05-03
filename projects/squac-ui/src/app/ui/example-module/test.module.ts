import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";

import { MaterialModule } from "@shared/material.module";
import { TestComponent } from "./test/test.component";
import { MaterialTestComponent } from "./material-test/test.component";
import { TestRoutingModule } from "./test-routing.module";

/**
 *
 */
@NgModule({
  declarations: [TestComponent, MaterialTestComponent],
  imports: [MaterialModule, SharedModule, TestRoutingModule],
})
export class TestModule {}
