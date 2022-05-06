import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { LoadingComponent } from "./components/loading/loading.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { MaterialModule } from "./material.module";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { ErrorComponent } from "./components/error/error.component";
import { AbilityModule } from "@casl/angular";
import { ConfirmDialogComponent } from "./components/confirm-dialog/confirm-dialog.component";
import { ReplacePipe } from "./pipes/replace.pipe";
import { OrganizationPipe } from "./pipes/organization.pipe";
import { SnackbarComponent } from "./components/snackbar/snackbar.component";
import { UserPipe } from "./pipes/user.pipe";
import { SharedIndicatorComponent } from "./components/shared-indicator/shared-indicator.component";
import { TableViewComponent } from "./components/table-view/table-view.component";
import { SearchFilterComponent } from "./components/search-filter/search-filter.component";
import { DateSelectComponent } from "./components/date-select/date-select.component";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { NgxEchartsModule } from "ngx-echarts";
@NgModule({
  declarations: [
    SearchFilterComponent,
    ConfirmDialogComponent,
    LoadingComponent,
    ErrorComponent,
    ReplacePipe,
    OrganizationPipe,
    SnackbarComponent,
    UserPipe,
    SharedIndicatorComponent,
    TableViewComponent,
    DateSelectComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LeafletModule,
    LeafletDrawModule,
    NgxEchartsModule,
    AbilityModule,
    NgxDatatableModule,
    FormsModule,
    RouterModule,
    NgxDaterangepickerMd.forRoot(),
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
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
    OrganizationPipe,
    SnackbarComponent,
    SharedIndicatorComponent,
    UserPipe,
    TableViewComponent,
    SearchFilterComponent,
    DateSelectComponent,
    NgxEchartsModule,
  ],
})
export class SharedModule {}
