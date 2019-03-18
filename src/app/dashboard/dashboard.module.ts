import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {RouterModule} from '@angular/router';
import {routes} from './dashboard.routing';
import {MaterialModules} from '../material-modules';
import { ReportsComponent } from './reports/reports.component';
import { DailyActivityComponent } from './daily-activity/daily-activity.component';
import {AddEditProductModalComponent, ProductsComponent} from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import {ProductsService} from '../services/products.service';
import {MAT_DIALOG_DEFAULT_OPTIONS, MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import { SliderComponent } from './slider/slider.component';
import {OwlModule} from 'ngx-owl-carousel';

@NgModule({
  declarations: [
    DashboardComponent,
    ReportsComponent,
    DailyActivityComponent,
    ProductsComponent,
    CategoriesComponent,
    AddEditProductModalComponent,
    SliderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModules,
    ReactiveFormsModule,
    OwlModule
  ],
  entryComponents: [
    AddEditProductModalComponent
  ],
  providers: [
    ProductsService,
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}}
  ]
})
export class DashboardModule { }
