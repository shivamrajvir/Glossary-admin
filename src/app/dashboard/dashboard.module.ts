import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {RouterModule} from '@angular/router';
import {routes} from './dashboard.routing';
import {MaterialModules} from '../material-modules';
import { ReportsComponent } from './reports/reports.component';
import {AddEditProductModalComponent, ProductsComponent} from './products/products.component';
import {AddEditCategoryModalComponent, CategoriesComponent} from './categories/categories.component';
import {ProductsService} from '../services/products.service';
import {MAT_DIALOG_DEFAULT_OPTIONS, MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import {addSliderModal, SliderComponent} from './slider/slider.component';
import {SliderService} from '../services/slider.service';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {CategoryService} from '../services/category.service';


@NgModule({
  declarations: [
    DashboardComponent,
    ReportsComponent,
    ProductsComponent,
    CategoriesComponent,
    AddEditProductModalComponent,
    SliderComponent,
    addSliderModal,
    AddEditCategoryModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModules,
    ReactiveFormsModule,
    CarouselModule
  ],
  entryComponents: [
    AddEditProductModalComponent,
    addSliderModal,
    AddEditCategoryModalComponent
  ],
  providers: [
    ProductsService,
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
    SliderService,
    CategoryService
  ]
})
export class DashboardModule { }
