import {Component, Inject, OnInit} from '@angular/core';
import {ProductsService} from '../../services/products.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {Urls} from '../../shared/urls';
import {HttpClient, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  loaded = false;
  products = [];
  displayedColumns = [];
  imageUrl = environment.imageUrl;

  constructor(private _product: ProductsService, private snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit() {
    this.getProductList();
  }

  getProductList() {
    this._product.getProductList()
      .then((data: any) => {
        console.log(data);
        this.products = data;
        this.displayedColumns = Object.keys(this.products[0]);
        this.displayedColumns.push('Actions');
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

  openAddEditProductModal(data?) {
    const dialogRef = this.dialog.open(AddEditProductModalComponent, {
      width: '600px',
      data: {
        data: data ? data : ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getProductList();
    });
  }

}

@Component({
  templateUrl: 'add-edit-product.html',
})
export class AddEditProductModalComponent {
  addEditProductForm: FormGroup;
  imageUrl = environment.imageUrl;
  isImageUploading = false;
  imageUploadFile;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data,
    public snackbar: MatSnackBar, private _product: ProductsService,
    private http: HttpClient) {
    this.initializeForm(this.data.data);
  }

  initializeForm(data?) {
      this.addEditProductForm = new FormGroup({
        name: new FormControl('', Validators.required),
        image: new FormControl('', Validators.required)
      });

      if (data) {
        this.addEditProductForm.controls['name'].setValue(data.name);
        this.addEditProductForm.controls['image'].setValue(data.image);
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
        this.addEditProductForm.controls['image'].setValue(data[0].pathName);
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
    this.addEditProductForm.controls['image'].setValue('');
  }

  addEditProduct() {
    this.isImageUploading = true;
    if (this.addEditProductForm.valid) {
      if (this.data.data) {
        const object = new HttpParams()
          .set('name', this.addEditProductForm.value.name)
          .set('fileName', this.addEditProductForm.value.image)
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
          .set('name', this.addEditProductForm.value.name)
          .set('fileName', this.addEditProductForm.value.image);
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
