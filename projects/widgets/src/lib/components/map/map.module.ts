import { NgModule } from "@angular/core";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";

import { MapComponent } from "./map.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [MapComponent],
  imports: [LeafletModule, SharedModule],
  exports: [MapComponent],
  providers: [],
})
export class MapModule {}
