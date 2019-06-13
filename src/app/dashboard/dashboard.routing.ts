import {DashboardComponent} from './dashboard.component';
import {Routes} from '@angular/router';
import {ReportsComponent} from './reports/reports.component';
import {ProductsComponent} from './products/products.component';
import {CategoriesComponent} from './categories/categories.component';
import {SliderComponent} from './slider/slider.component';
import {AddressesComponent} from './addresses/addresses.component';
import {NotificationSettingsComponent} from './notification-settings/notification-settings.component';
import { SubCategoryDetailsComponent } from './sub-category-details/sub-category-details.component';
import {UnitsComponent} from './units/units.component';
import {UsersComponent} from './users/users.component';
import {UserDetailsComponent} from './users/user-details/user-details.component';
import {SubCategoryComponent} from './categories/sub-category/sub-category.component';
import {OrderDetailsComponent} from './users/user-details/order-details/order-details.component';

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
      },
      {
        path: 'units',
        component: UnitsComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'users/user-details',
        component: UserDetailsComponent
      },
      {
        path: 'users/user-details/order-details/:id',
        component: OrderDetailsComponent
      }
    ]
  }
];
