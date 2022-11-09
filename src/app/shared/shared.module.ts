import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { LoadingComponent } from "./components/loading/loading.component";
import { NgxDatatableModule } from "@boring.devs/ngx-datatable";
import { MaterialModule } from "./material.module";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { ErrorComponent } from "./components/error/error.component";
import { AbilityModule } from "@casl/angular";
import { ConfirmDialogComponent } from "./components/confirm-dialog/confirm-dialog.component";
import { ReplacePipe } from "./pipes/replace.pipe";
import { SnackbarComponent } from "./components/snackbar/snackbar.component";
import { SharedIndicatorComponent } from "./components/shared-indicator/shared-indicator.component";
import { TableViewComponent } from "./components/table-view/table-view.component";
import { SearchFilterComponent } from "./components/search-filter/search-filter.component";
import { DateSelectComponent } from "./components/date-select/date-select.component";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { ChannelGroupSelectorComponent } from "./components/channel-group-selector/channel-group-selector.component";
import { LoadingDirective } from "./directives/loading-directive.directive";
import { LoadingOverlayComponent } from "./components/loading-overlay/loading-overlay.component";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { SquacapiModule } from "@squacapi/squacapi.module";
@NgModule({
  declarations: [
    SearchFilterComponent,
    ConfirmDialogComponent,
    LoadingComponent,
    ErrorComponent,
    ReplacePipe,
    SnackbarComponent,
    SharedIndicatorComponent,
    TableViewComponent,
    DateSelectComponent,
    ChannelGroupSelectorComponent,
    LoadingOverlayComponent,
    LoadingDirective,
    LoadingSpinnerComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LeafletModule,
    LeafletDrawModule,
    AbilityModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxDaterangepickerMd.forRoot(),
    SquacapiModule,
  ],
  exports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingComponent,
    NgxDatatableModule,
    ErrorComponent,
    AbilityModule,
    ConfirmDialogComponent,
    ReplacePipe,
    LeafletModule,
    LeafletDrawModule,
    SnackbarComponent,
    SharedIndicatorComponent,
    TableViewComponent,
    SearchFilterComponent,
    DateSelectComponent,
    ChannelGroupSelectorComponent,
    LoadingOverlayComponent,
    LoadingSpinnerComponent,
    LoadingDirective,
    SquacapiModule,
  ],
})
export class SharedModule {}
