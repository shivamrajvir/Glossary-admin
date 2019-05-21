import {Component, Inject, OnInit} from '@angular/core';
import {SubCategoryService} from '../../services/sub-category.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {CategoryService} from '../../services/category.service';
import {HttpClient} from '@angular/common/http';
import {AddEditSubCategoryModalComponent} from '../categories/sub-category/sub-category.component';

@Component({
  selector: 'app-sub-category-details',
  templateUrl: './sub-category-details.component.html',
  styleUrls: ['./sub-category-details.component.scss']
})
export class SubCategoryDetailsComponent implements OnInit {

  details = [];

  constructor(private _subCategory: SubCategoryService, private router: Router,  public dialog: MatDialog) {
  }

  ngOnInit() {
    if (this._subCategory.subCategoryDetails) {
      console.log(this._subCategory.subCategoryDetails);
      this.details = this._subCategory.subCategoryDetails.qunatityDetails;
    } else {
      this.router.navigate(['dashboard/categories']);
    }
  }

  refreshList() {

  }

  openSubCategoryDetailsModal(data?) {
    const dialogRef = this.dialog.open(AddEditSubCategoryDetailsModalComponent, {
      width: '600px',
      data: {
        data: data ? data : ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshList();
    });
  }

}


@Component({
  templateUrl: 'add-edit-subcategory-modal.html',
})
export class AddEditSubCategoryDetailsModalComponent {
  detailForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data,
    public snackbar: MatSnackBar,
    private http: HttpClient, private _subCat: SubCategoryService) {
    this.initializeSubCategoryForm(this.data.data ? this.data.data : null);
  }

  initializeSubCategoryForm(data?) {
    this.detailForm = new FormGroup({
      quantity: new FormControl(null),
      stock: new FormControl(null),
      unit: new FormControl(null),
      purchaseprice: new FormControl(null),
      margin: new FormControl(null),
      price: new FormControl(null),
      disprice: new FormControl(null)
    });
  }

}
