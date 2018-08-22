import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetworkDetailComponent } from './network-detail/network-detail.component';
import { NetworksComponent } from './networks/networks.component';
import { StationsComponent } from './stations/stations.component';
import { StationDetailComponent } from './station-detail/station-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'stations/:station', component: StationDetailComponent },
  { path: 'networks/:network', component: NetworkDetailComponent },
  { path: 'stations', component: StationsComponent },
  { path: 'networks', component: NetworksComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

//TODO: pagenotfound

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
