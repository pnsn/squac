import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GroupsComponent } from './groups/groups.component';
import { MetricsComponent } from './metrics/metrics.component';
import { MetricsEditComponent } from './metrics/metrics-edit/metrics-edit.component';
import { MetricDetailComponent } from './metrics/metric-detail/metric-detail.component';
import { DashboardEditComponent } from './dashboard/dashboard-edit/dashboard-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    GroupsComponent,
    MetricsComponent,
    MetricsEditComponent,
    MetricDetailComponent,
    DashboardEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
