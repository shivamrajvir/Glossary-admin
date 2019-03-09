import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {RouterModule} from '@angular/router';
import {routes} from './dashboard.routing';
import {MaterialModules} from '../material-modules';
import { ReportsComponent } from './reports/reports.component';
import { DailyActivityComponent } from './daily-activity/daily-activity.component';
import { OneTimeActivityComponent } from './one-time-activity/one-time-activity.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ReportsComponent,
    DailyActivityComponent,
    OneTimeActivityComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModules
  ]
})
export class DashboardModule { }
