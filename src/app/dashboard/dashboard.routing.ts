import {DashboardComponent} from './dashboard.component';
import {Routes} from '@angular/router';
import {DailyActivityComponent} from './daily-activity/daily-activity.component';
import {ReportsComponent} from './reports/reports.component';
import {ProductsComponent} from './products/products.component';
import {CategoriesComponent} from './categories/categories.component';

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
        path: 'products',
        component: ProductsComponent
      },
      {
        path: 'categories',
        component: CategoriesComponent
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
