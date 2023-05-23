import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { NgModule } from "@angular/core";
import { ChannelGroupComponent } from "./components/channel-group.component";
import { ChannelGroupEditComponent } from "./components/channel-group-edit/channel-group-edit.component";
import { ChannelGroupViewComponent } from "./components/channel-group-view/channel-group-view.component";
import { ChannelGroupFilterComponent } from "./components/channel-group-edit/channel-group-filter/channel-group-filter.component";
import { ChannelGroupRoutingModule } from "./channel-group-routing.module";
import { ChannelGroupDetailComponent } from "./components/channel-group-detail/channel-group-detail.component";
import { ChannelGroupMapComponent } from "./components/channel-group-map/channel-group-map.component";
import { MatchingRuleEditComponent } from "./components/channel-group-edit/matching-rule-edit/matching-rule-edit.component";
import { ChannelGroupTableComponent } from "./components/channel-group-edit/channel-group-table/channel-group-table.component";
import { NgxCsvParserModule } from "ngx-csv-parser";
import { CsvUploadComponent } from "./components/channel-group-edit/csv-upload/csv-upload.component";
import { TooltipModule } from "@ui/tooltip/tooltip.module";
import { LoadingDirective } from "@shared/directives/loading-directive.directive";
/**
 *
 */
@NgModule({
  declarations: [
    ChannelGroupMapComponent,
    ChannelGroupComponent,
    ChannelGroupEditComponent,
    ChannelGroupViewComponent,
    ChannelGroupFilterComponent,
    ChannelGroupDetailComponent,
    MatchingRuleEditComponent,
    ChannelGroupTableComponent,
    CsvUploadComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ChannelGroupRoutingModule,
    NgxCsvParserModule,
    TooltipModule,
    LoadingDirective,
  ],
})
export class ChannelGroupModule {}
