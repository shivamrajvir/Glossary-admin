import {DashboardComponent} from './dashboard.component';
import {Routes} from '@angular/router';
import {OneTimeActivityComponent} from './one-time-activity/one-time-activity.component';
import {DailyActivityComponent} from './daily-activity/daily-activity.component';
import {ReportsComponent} from './reports/reports.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'reports'
      },
      {
        path: 'one-time-activity',
        component: OneTimeActivityComponent
      },
      {
        path: 'daily-activity',
        component: DailyActivityComponent
      },
      {
        path: 'reports',
        component: ReportsComponent
      }
    ]
  }
];
