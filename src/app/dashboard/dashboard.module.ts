import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {RouterModule} from '@angular/router';
import {routes} from './dashboard.routing';
import {MaterialModules} from '../material-modules';
import { ReportsComponent } from './reports/reports.component';
import { DailyActivityComponent } from './daily-activity/daily-activity.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import {ProductsService} from '../services/products.service';

@NgModule({
  declarations: [
    DashboardComponent,
    ReportsComponent,
    DailyActivityComponent,
    ProductsComponent,
    CategoriesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModules
  ],
  providers: [
    ProductsService
  ]
})
export class DashboardModule { }
