import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PopupComponent } from './popup/popup.component';
import { LoadingComponent } from './loading/loading.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialModule } from './material.module';
import { MapComponent } from './map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { ErrorComponent } from './error/error.component';
import { AbilityModule } from '@casl/angular';
@NgModule({
  declarations: [
    ModalComponent,
    PopupComponent,
    LoadingComponent,
    MapComponent,
    ErrorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LeafletModule,
    LeafletDrawModule,
    AbilityModule
  ],
  exports: [
    MaterialModule,
    ModalComponent,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingComponent,
    NgxDatatableModule,
    MapComponent,
    ErrorComponent,
    AbilityModule
  ]
})

export class SharedModule { }
