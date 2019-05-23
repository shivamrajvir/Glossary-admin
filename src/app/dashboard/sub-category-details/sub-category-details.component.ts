import {Component, Inject, OnInit} from '@angular/core';
import {SubCategoryService} from '../../services/sub-category.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CategoryService} from '../../services/category.service';

@Component({
  selector: 'app-sub-category-details',
  templateUrl: './sub-category-details.component.html',
  styleUrls: ['./sub-category-details.component.scss']
})
export class SubCategoryDetailsComponent implements OnInit {

  details = [];
  loaded = false;
  displayedColumns = ['no', 'quantity', 'unit', 'stock', 'Purchase Price', 'Price', 'Discount Price', 'actions'];

  constructor(public _subCategory: SubCategoryService, private router: Router,  public dialog: MatDialog,
              public _category: CategoryService, public snackbar: MatSnackBar) {
  }

  ngOnInit() {
    if (this._subCategory.subCategoryDetails) {
      console.log(this._subCategory.subCategoryDetails);
      this.details = this._subCategory.subCategoryDetails.qunatityDetails;
      console.log(this.details);
      this.loaded = true;
    } else {
      this.router.navigate(['dashboard/categories']);
    }
  }

  changeDetailStatus(index) {
    this.details[index].status = this.details[index].status === '1' ? '0' : '1';
    const object = new HttpParams()
      .set('id', this.details[index].id)
      .set('status', this.details[index].status === '1' ? '0' : '1');
    this._category.changeCategoryStatus(object)
      .then(data => {
        const status = this.details[index].status === '0' ? 'De-activated' : 'Activated';
        this.snackbar.open('Your Sub Category has been ' + status, 'Success', {
          duration: 2000
        });
      })
      .catch(err => {
        console.error(err);
        this.details[index].status = this.details[index].status === '1' ? '0' : '1';
        const error = 'Internal Server Error';
        this.snackbar.open(error, 'Error', {
          duration: 2000
        });
      });
  }

  refreshList() {
    this._category.getCategoriesByProductID(this._category.selectedCategory)
      .then(data => {
        console.log(data);
      }).catch(err => {
        console.error(err);
    });
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
  templateUrl: 'add-edit-subCatDetails.html',
})
export class AddEditSubCategoryDetailsModalComponent {
  detailForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data,
    public snackbar: MatSnackBar, private _subCat: SubCategoryService) {
    this.initializeSubCategoryForm(this.data.data ? this.data.data : null);
    console.log(this.data);
  }

  closeModal() {
    this.dialogRef.close();
  }

  initializeSubCategoryForm(data?) {
    this.detailForm = new FormGroup({
      quantity: new FormControl(null, Validators.required),
      stock: new FormControl(null, Validators.required),
      unit: new FormControl(null, Validators.required),
      margin: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      purchasePrice: new FormControl(null, Validators.required),
    });

    if (data) {
      this.detailForm.patchValue(data);
      this.detailForm.controls['unit'].setValue(data.UnitName);
      this.detailForm.controls['quantity'].setValue(data.subQuantity);
    }
  }

  addEditSubCateDetails() {
    if (this.detailForm.valid) {
      let discountPrice: any = parseInt(this.detailForm.value.margin, 10) / 100 *  parseInt(this.detailForm.value.price, 10);
      discountPrice = discountPrice.toString();
      if (this.data.data.id) {
        const object = new HttpParams()
          .set('unit', this.detailForm.value.unit)
          .set('margin', this.detailForm.value.margin)
          .set('stock', this.detailForm.value.stock)
          .set('price', this.detailForm.value.price)
          .set('purchaseprice', this.detailForm.value.purchasePrice)
          .set('quantity', this.detailForm.value.quantity)
          .set('disprice', discountPrice)
          .set('subcatid', this.data.data.subQuantId)
          .set('id', this.data.data.id);
        this._subCat.editSubCategoryDetails(object)
          .then(data => {
            console.log(data);
            this.closeModal();
          }).catch(err => {
          console.error(err);
        });
      } else {
        const object = new HttpParams()
          .set('unit', this.detailForm.value.unit)
          .set('margin', this.detailForm.value.margin)
          .set('stock', this.detailForm.value.stock)
          .set('price', this.detailForm.value.price)
          .set('purchaseprice', this.detailForm.value.purchasePrice)
          .set('quantity', this.detailForm.value.quantity)
          .set('subcatid', this.data.data.subQuantId)
          .set('disprice', discountPrice);
        this._subCat.addSubCategoryDetails(object)
          .then(data => {
            console.log(data);
            this.closeModal();
          }).catch(err => {
            console.error(err);
        });
      }

    } else {
      this.snackbar.open('Error', 'Please Enter All details', {
        duration: 4000
      });
    }
  }

}
