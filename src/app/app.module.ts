import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GroupsComponent } from './groups/groups.component';
import { MetricsComponent } from './metrics/metrics.component';
import { EditGroupsComponent } from './groups/edit-groups/edit-groups.component';
import { EditMetricsComponent } from './metrics/edit-metrics/edit-metrics.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    GroupsComponent,
    MetricsComponent,
    EditGroupsComponent,
    EditMetricsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
