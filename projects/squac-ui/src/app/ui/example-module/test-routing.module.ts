import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MaterialTestComponent } from "./material-test/test.component";
import { TestComponent } from "./test/test.component";

export const routes: Routes = [
  {
    path: "",
    component: TestComponent,
  },
  {
    path: "material-test",
    component: MaterialTestComponent,
  },
];

/** Dashboard routing module */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestRoutingModule {}
