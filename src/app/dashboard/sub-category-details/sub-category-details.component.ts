import {Component, Inject, OnInit} from '@angular/core';
import {SubCategoryService} from '../../services/sub-category.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {HttpParams} from '@angular/common/http';
import {CategoryService} from '../../services/category.service';

@Component({
  selector: 'app-sub-category-details',
  templateUrl: './sub-category-details.component.html',
  styleUrls: ['./sub-category-details.component.scss']
})
export class SubCategoryDetailsComponent implements OnInit {

  details = [];
  loaded = false;
  displayedColumns = ['no', 'quantity', 'stock', 'Purchase Price', 'Price', 'margin', 'Discount Price', 'actions'];

  constructor(public _subCategory: SubCategoryService, private router: Router,  public dialog: MatDialog,
              public _category: CategoryService, public snackbar: MatSnackBar) {
  }

  ngOnInit() {
    if (this._subCategory.subCategoryDetails) {
      this.details = this._subCategory.subCategoryDetails.qunatityDetails;
      this.loaded = true;
    } else {
      this.router.navigate(['dashboard/categories']);
    }
  }

  changeDetailStatus(index) {
    this.details[index].sta = this.details[index].sta === '1' ? '0' : '1';
    const object = new HttpParams()
      .set('id', this.details[index].subQuantId)
      .set('status', this.details[index].sta === '1' ? '0' : '1');
    this._subCategory.changeSubCategoryDetailStatus(object)
      .then(data => {
        const status = this.details[index].sta === '0' ? 'De-activated' : 'Activated';
        this.snackbar.open('Your Sub Category has been ' + status, 'Success', {
          duration: 2000
        });
      })
      .catch(err => {
        console.error(err);
        this.details[index].sta = this.details[index].sta === '1' ? '0' : '1';
        const error = 'Internal Server Error';
        this.snackbar.open(error, 'Error', {
          duration: 2000
        });
      });
  }

  refreshList() {
    const obj = new HttpParams()
      .set('catId', this._category.selectedCategory.id);
    this._subCategory.getSubCategories(obj)
      .then((data: any) => {
        data.SubCategoriesDetails.find(d => {
          if (d.id === this._subCategory.subCategoryDetails.id) {
            this.details = d.qunatityDetails;
          }
        });
      }).catch(err => {
      console.error(err);
      this.loaded = true;
      this.snackbar.open('Error while fetching Sub Categories', 'Error', {
        duration: 2000
      });
    });
  }

  openSubCategoryDetailsModal(data?) {
    const dialogRef = this.dialog.open(AddEditSubCategoryDetailsModalComponent, {
      width: '600px',
      data: {
        data: data ? {
          data: data,
          id: this._subCategory.subCategoryDetails.id
        } : {
          id: this._subCategory.subCategoryDetails.id
        }
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
  units: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data,
    public snackbar: MatSnackBar, private _subCat: SubCategoryService) {
    this.initializeSubCategoryForm(this.data.data.data ? this.data.data.data : null);
    this.getUnits();
  }

  async getUnits() {
    try {
      // @ts-ignore
      this.units = await this._subCat.getUnits();
      this.units = this.units.filter(u => {
        return (u.status === '1');
      });
    } catch (err) {
      console.error(err);
    }
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
      this.detailForm.controls['unit'].setValue(data.unitId);
      this.detailForm.controls['quantity'].setValue(data.subQuantity);
    }
  }

  addEditSubCateDetails() {
    if (this.detailForm.valid) {
      const profit: any = parseInt(this.detailForm.value.purchasePrice, 10) * parseInt(this.detailForm.value.margin, 10) /  100;
      const discountPrice = profit + parseInt(this.detailForm.value.purchasePrice, 10);
      if (this.data.data.data) {
        const object = new HttpParams()
          .set('unit', this.detailForm.value.unit)
          .set('margin', this.detailForm.value.margin)
          .set('stock', this.detailForm.value.stock)
          .set('price', this.detailForm.value.price)
          .set('purchaseprice', this.detailForm.value.purchasePrice)
          .set('quantity', this.detailForm.value.quantity)
          .set('disprice', discountPrice)
          .set('subcatid', this.data.data.data.subQuantId)
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
          .set('subcatid', this.data.data.id)
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

  restrictInputNumbers(e) {
    if (e.keyCode === 43 || e.keyCode === 101 || e.keyCode === 45 || e.keyCode === 46) {
      e.preventDefault();
    }
  }

}
