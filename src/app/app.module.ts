import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatListModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSliderModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { NetworksComponent } from './networks/networks.component';
import { NetworkDetailComponent } from './network-detail/network-detail.component';
import { StationsComponent } from './stations/stations.component';
import { StationDetailComponent } from './station-detail/station-detail.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ChannelGroupsComponent } from './channel-groups/channel-groups.component';
import { ChannelGroupsDetailComponent } from './channel-groups-detail/channel-groups-detail.component';
import { ChannelGroupsCreateComponent } from './channel-groups-create/channel-groups-create.component';
@NgModule({
  declarations: [
    AppComponent,
    NetworksComponent,
    NetworkDetailComponent,
    StationsComponent,
    StationDetailComponent,
    DashboardComponent,
    PageNotFoundComponent,
    ChannelGroupsComponent,
    ChannelGroupsDetailComponent,
    ChannelGroupsCreateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
