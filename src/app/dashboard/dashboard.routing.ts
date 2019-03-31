import {DashboardComponent} from './dashboard.component';
import {Routes} from '@angular/router';
import {ReportsComponent} from './reports/reports.component';
import {ProductsComponent} from './products/products.component';
import {CategoriesComponent} from './categories/categories.component';
import {SliderComponent} from './slider/slider.component';
import {AddressesComponent} from './addresses/addresses.component';

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
        path: 'reports',
        component: ReportsComponent
      },
      {
        path: 'slider',
        component: SliderComponent
      },
      {
        path: 'address',
        component: AddressesComponent
      }
    ]
  }
];
