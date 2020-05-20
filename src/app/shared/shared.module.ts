import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PopupComponent } from './popup/popup.component';
import { LoadingComponent } from './loading/loading.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialModule } from './material.module';
import { MapComponent } from './map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { AbilityModule } from '@casl/angular';
import { ErrorComponent } from './error/error.component';

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
    HttpClientModule,
    LoadingComponent,
    NgxDatatableModule,
    MapComponent,
    AbilityModule,
    ErrorComponent
  ]
})

export class SharedModule { }
