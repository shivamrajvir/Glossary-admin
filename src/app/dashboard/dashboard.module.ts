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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {addSliderModalComponent, SliderComponent} from './slider/slider.component';
import {SliderService} from '../services/slider.service';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {CategoryService} from '../services/category.service';
import { AddressesComponent, AddCityModalComponent } from './addresses/addresses.component';
import {AddressService} from '../services/address.service';
import {
  AddEditNotificationModalComponent,
  NotificationSettingsComponent
} from './notification-settings/notification-settings.component';
import { NotificationService } from '../services/notification.service';
import {AddEditSubCategoryModalComponent, SubCategoryComponent} from './categories/sub-category/sub-category.component';
import {AddEditSubCategoryDetailsModalComponent, SubCategoryDetailsComponent} from './sub-category-details/sub-category-details.component';
import {SubCategoryService} from '../services/sub-category.service';
import { UnitsComponent, AddEditUnitModalComponent } from './units/units.component';
import { UsersComponent } from './users/users.component';
import {UsersService} from '../services/users.service';
import { UserDetailsComponent } from './users/user-details/user-details.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ReportsComponent,
    ProductsComponent,
    CategoriesComponent,
    AddEditProductModalComponent,
    SliderComponent,
    addSliderModalComponent,
    AddEditCategoryModalComponent,
    AddressesComponent,
    AddCityModalComponent,
    NotificationSettingsComponent,
    SubCategoryComponent,
    AddEditSubCategoryModalComponent,
    AddEditNotificationModalComponent,
    SubCategoryDetailsComponent,
    AddEditSubCategoryDetailsModalComponent,
    UnitsComponent,
    AddEditUnitModalComponent,
    UsersComponent,
    UserDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModules,
    ReactiveFormsModule,
    CarouselModule,
    FormsModule
  ],
  entryComponents: [
    AddEditProductModalComponent,
    addSliderModalComponent,
    AddEditCategoryModalComponent,
    AddCityModalComponent,
    AddEditSubCategoryModalComponent,
    AddEditNotificationModalComponent,
    AddEditSubCategoryDetailsModalComponent,
    AddEditUnitModalComponent
  ],
  providers: [
    ProductsService,
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
    SliderService,
    CategoryService,
    AddressService,
    NotificationService,
    SubCategoryService,
    UsersService
  ]
})
export class DashboardModule { }
