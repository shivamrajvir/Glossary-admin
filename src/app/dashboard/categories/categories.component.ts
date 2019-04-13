import {Component, Inject, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ProductsService} from '../../services/products.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {AddEditProductModalComponent} from '../products/products.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Urls} from '../../shared/urls';
import {CategoryService} from '../../services/category.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  loaded = false;
  categories = [];
  displayedColumns = ['id', 'name', 'image', 'status', 'datetime', 'Actions', 'subcat'];
  imageUrl = environment.imageUrl;
  selectedProduct;
  productList = [];

  constructor(private _product: ProductsService, private _category: CategoryService,
              private snackBar: MatSnackBar, public dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.getProductList();
  }

  getProductList() {
    this._product.getProductList()
      .then((data: any) => {
        this.productList = data;
        this.selectedProduct = data[0].id;
        this.getCategories();
      })
      .catch(err => {
        console.error(err);
        const error = (err.error && err.error.message) ? err.error.message : 'Internal Server Error';
        this.snackBar.open(error, 'Error', {
          duration: 2000
        });
      });
  }

  getCategories() {
    const fd = new HttpParams()
      .set('p_id', this.selectedProduct);
    this._category.getCategoriesByProductID(fd)
      .then((data: any[]) => {
        this.categories = data;
        this.loaded = true;
      })
      .catch(err => {
        console.error(err);
        this.loaded = true;
        const error = (err.error && err.error.message) ? err.error.message : 'Internal Server Error';
        this.snackBar.open(error, 'Error', {
          duration: 2000
        });
      });
  }

  productSelectionChanged() {
    this.loaded = false;
    this.getCategories();
  }

  openAddEditCategoryModal(data?) {
    const dialogRef = this.dialog.open(AddEditCategoryModalComponent, {
      width: '600px',
      data: {
        data: data ? data : '',
        p_id: this.selectedProduct
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCategories();
    });
  }

  changeCategoryStatus(index) {
    this.categories[index].status = this.categories[index].status === '1' ? '0' : '1';
    const object = new HttpParams()
      .set('catId', this.categories[index].id)
      .set('catStatus', this.categories[index].status === '1' ? '0' : '1');
    this._category.changeCategoryStatus(object)
      .then(data => {
        const status = this.categories[index].status === '0' ? 'De-activated' : 'Activated';
        this.snackBar.open('Your Category has been ' + status, 'Success', {
          duration: 2000
        });
      })
      .catch(err => {
        console.error(err);
        this.categories[index].status = this.categories[index].status === '1' ? '0' : '1';
        const error = (err.error && err.error.message) ? err.error.message : 'Internal Server Error';
        this.snackBar.open(error, 'Error', {
          duration: 2000
        });
      });
  }

  goToSubcategoriesPage(category) {
    this._category.selectedCategory = category;
    this.router.navigate(['dashboard/categories/sub-categories']);
  }

}




@Component({
  templateUrl: 'add-edit-category-modal.html',
})
export class AddEditCategoryModalComponent {
  addEditCategoryForm: FormGroup;
  imageUrl = environment.imageUrl;
  isImageUploading = false;
  imageUploadFile;
  products = [];
  p_id;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data,
    public snackbar: MatSnackBar, private _category: CategoryService,
    private http: HttpClient, private _product: ProductsService) {
    this.getProductList();
    this.p_id = this.data.p_id;
    this.initializeForm(this.data.data);
  }

  getProductList() {
    this._product.getProductList()
      .then((data: any) => {
        this.products = data;
        if (this.data.data) {
          this.addEditCategoryForm.controls['productId'].setValue(this.data.data.product_id);
        }
      })
      .catch(err => {
        console.error(err);
        const error = (err.error && err.error.message) ? err.error.message : 'Internal Server Error';
        this.snackbar.open(error, 'Error', {
          duration: 2000
        });
      });
  }

  initializeForm(data?) {
    this.addEditCategoryForm = new FormGroup({
      name: new FormControl('', Validators.required),
      fileName: new FormControl('', Validators.required),
      productId: new FormControl('', Validators.required)
    });

    if (data) {
      this.addEditCategoryForm.controls['name'].setValue(data.name);
      this.addEditCategoryForm.controls['fileName'].setValue(data.image);
      setTimeout(() => {
        this.addEditCategoryForm.controls['productId'].disable();
      }, 0);
      this.addEditCategoryForm.controls['productId'].setValue(data.p_id);
    } else {
      setTimeout(() => {
        this.addEditCategoryForm.controls['productId'].enable();
      }, 0);
    }
  }

  uploadImage(event) {
    const file = event.target.files[0];
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      this.uploadFile(file);
    } else {
      this.snackbar.open('Please Upload an image with .jpg or .png format', 'Error', {
        duration: 4000
      });
    }
  }

  uploadFile(file) {
    this.isImageUploading = true;
    const fd = new FormData();
    let name = '';
    if (file.type === 'image/jpeg') {
      name = new Date().getFullYear().toString() + new Date().getMonth().toString() + new Date().getDate().toString() + '.jpg';
    } else if (file.type === 'image/png') {
      name = new Date().getFullYear().toString() + new Date().getMonth().toString() + new Date().getDate().toString() + '.png';
    }
    this.imageUploadFile = file;
    fd.append('tmp_name', name);
    fd.append('file', file);
    this.http.post(Urls.upload_product_image, fd)
      .subscribe((data: any) => {
        this.isImageUploading = false;
        this.addEditCategoryForm.controls['fileName'].setValue(data[0].pathName);
        this.snackbar.open('Image Uploaded', 'Success', {
          duration: 4000
        });
      }, err => {
        this.isImageUploading = false;
        console.error(err);
        this.snackbar.open((err.error && err.error.message) ? err.error.message : 'Server Error', 'Error', {
          duration: 4000
        });
      });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  deleteImage() {
    this.addEditCategoryForm.controls['fileName'].setValue('');
  }

  addEditCategory() {
    this.isImageUploading = true;
    if (this.addEditCategoryForm.valid) {
      if (this.data.data) {
        const object = new HttpParams()
          .set('name', this.addEditCategoryForm.value.name)
          .set('fileName', this.addEditCategoryForm.value.fileName)
          .set('id', this.data.data.id)
          .set('p_id', this.p_id);
        this._category.editCategory(object)
          .then(data => {
            this.closeModal();
          })
          .catch(err => {
            console.error(err);
            this.snackbar.open((err.error && err.error.message) ? err.error.message : 'Server Error', 'Error', {
              duration: 4000
            });
          });
      } else {
        const object = new HttpParams()
          .set('name', this.addEditCategoryForm.value.name)
          .set('fileName', this.addEditCategoryForm.value.fileName)
          .set('p_id', this.addEditCategoryForm.value.productId);
        this._category.addCategory(object)
          .then(data => {
            this.isImageUploading = false;
            this.snackbar.open('Category Added', 'Success', {
              duration: 4000
            });
            this.closeModal();
          })
          .catch(err => {
            console.error(err);
            this.isImageUploading = false;
            this.snackbar.open((err.error && err.error.message) ? err.error.message : 'Server Error', 'Error', {
              duration: 4000
            });
          });
      }
    } else {
      this.snackbar.open('Please add Name and upload an image for the Category', 'Error', {
        duration: 4000
      });
    }
  }

}
