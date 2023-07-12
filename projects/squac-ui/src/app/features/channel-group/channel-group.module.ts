import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { NgModule } from "@angular/core";
import { ChannelGroupFilterComponent } from "./components/channel-group-filter/channel-group-filter.component";
import { ChannelGroupRoutingModule } from "./channel-group-routing.module";
import { ChannelGroupMapComponent } from "./components/channel-group-map/channel-group-map.component";
import { MatchingRuleEditComponent } from "./components/matching-rule-edit/matching-rule-edit.component";
import { ChannelGroupTableComponent } from "./components/channel-group-table/channel-group-table.component";
import { NgxCsvParserModule } from "ngx-csv-parser";
import { CsvUploadComponent } from "./components/csv-upload/csv-upload.component";
import { TooltipModule } from "@ui/tooltip/tooltip.module";
import { LoadingDirective } from "@shared/directives/loading-directive.directive";
import { ChannelGroupComponent } from "./pages/main/channel-group.component";
import { ChannelGroupEditComponent } from "./pages/edit/channel-group-edit.component";
import { ChannelGroupViewComponent } from "./pages/list/channel-group-view.component";
import { ChannelGroupDetailComponent } from "./pages/detail/channel-group-detail.component";
/**
 *
 */
@NgModule({
  declarations: [
    ChannelGroupComponent,
    ChannelGroupEditComponent,
    ChannelGroupViewComponent,
    ChannelGroupDetailComponent,
  ],
  imports: [
    ChannelGroupFilterComponent,
    MatchingRuleEditComponent,
    ChannelGroupTableComponent,
    CsvUploadComponent,
    ChannelGroupMapComponent,
    CommonModule,
    SharedModule,
    ChannelGroupRoutingModule,
    NgxCsvParserModule,
    TooltipModule,
    LoadingDirective,
  ],
})
export class ChannelGroupModule {}
