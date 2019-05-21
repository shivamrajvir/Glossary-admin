import {DashboardComponent} from './dashboard.component';
import {Routes} from '@angular/router';
import {ReportsComponent} from './reports/reports.component';
import {ProductsComponent} from './products/products.component';
import {CategoriesComponent} from './categories/categories.component';
import {SliderComponent} from './slider/slider.component';
import {AddressesComponent} from './addresses/addresses.component';
import {NotificationSettingsComponent} from './notification-settings/notification-settings.component';
import {SubCategoryComponent} from "./categories/sub-category/sub-category.component";
import { SubCategoryDetailsComponent } from './sub-category-details/sub-category-details.component';

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
        path: 'categories/sub-categories',
        component: SubCategoryComponent
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
      },
      {
        path: 'notifications',
        component: NotificationSettingsComponent
      },
      {
        path: 'category/subcategory/details',
        component: SubCategoryDetailsComponent
      }
    ]
  }
];
