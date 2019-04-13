import { Component, OnInit } from '@angular/core';
import {SubCategoryService} from '../../../services/sub-category.service';
import {MatSnackBar} from '@angular/material';
import {HttpParams} from "@angular/common/http";
import {CategoryService} from "../../../services/category.service";
import {Router} from "@angular/router";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {

  loaded = false;
  subCategories = [];
  displayedColumns = ['id', 'name', 'image', 'status', 'datetime', 'Actions', 'subcat'];
  imageUrl = environment.imageUrl;

  constructor(private _subCategory: SubCategoryService, private _category: CategoryService,
              protected snackbar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    console.log(this._category.selectedCategory);
    if (this._category.selectedCategory && this._category.selectedCategory.id) {
      const obj = new HttpParams()
        .set('catId', this._category.selectedCategory.id);
      this.getSubCategoryList(obj);
    } else {
      this.router.navigate(['dashboard/categories']);
    }
  }

  getSubCategoryList(obj) {
    this._subCategory.getSubCategories(obj)
      .then((data: any) => {
        this.subCategories = data;
        this.loaded = true;
      }).catch(err => {
        console.error(err);
      this.loaded = true;
      this.snackbar.open('Error while fetching Sub Categories', 'Error', {
        duration: 2000
      });
    });
  }

  openAddEditSubCategoryModal() {

  }

  changeSubCategoryStatus() {

  }

}
