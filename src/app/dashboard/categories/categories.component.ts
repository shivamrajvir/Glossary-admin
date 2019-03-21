import {Component, Inject, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ProductsService} from '../../services/products.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {AddEditProductModalComponent} from '../products/products.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Urls} from '../../shared/urls';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  loaded = false;
  products = [];
  categories = [];
  displayedColumns = [];
  imageUrl = environment.imageUrl;

  constructor(private _product: ProductsService, private snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.loaded = true;
    // this._product.getCategories();
  }

  openAddEditCategoryModal(data?) {
    const dialogRef = this.dialog.open(AddEditCategoryModalComponent, {
      width: '600px',
      data: {
        data: data ? data : ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
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

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data,
    public snackbar: MatSnackBar, private _product: ProductsService,
    private http: HttpClient) {
    this.getProductList();
    this.initializeForm(this.data.data);
  }

  getProductList() {
    this._product.getProductList()
      .then((data: any) => {
        this.products = data;
        if (this.data.data) {
          this.addEditCategoryForm.controls['productId'].setValue(this.data.data.p_id);
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
      this.addEditCategoryForm.controls['fileName'].setValue(data.fileName);
      this.addEditCategoryForm.controls['productId'].setValue(data.p_id);
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
    const name = file.name + new Date().toISOString();
    this.imageUploadFile = file;
    fd.append('tmp_name', file.name);
    fd.append('file', file);
    this.http.post(Urls.upload_product_image, fd)
      .subscribe((data: any) => {
        this.isImageUploading = false;
        console.log(data);
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

  addEditProduct() {
    this.isImageUploading = true;
    if (this.addEditCategoryForm.valid) {
      if (this.data.data) {
        const object = new HttpParams()
          .set('name', this.addEditCategoryForm.value.name)
          .set('fileName', this.addEditCategoryForm.value.fileName)
          .set('id', this.data.data.id);
        this._product.editProduct(object)
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
          .set('fileName', this.addEditCategoryForm.value.fileName);
        this._product.addProduct(object)
          .then(data => {
            this.isImageUploading = false;
            this.snackbar.open('Product Added', 'Success', {
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
      this.snackbar.open('Please add Name and upload an image for the product', 'Error', {
        duration: 4000
      });
    }
  }

}
