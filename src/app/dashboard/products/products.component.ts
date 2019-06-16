import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Urls } from '../../shared/urls';
import { HttpClient, HttpParams } from '@angular/common/http';

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
  activeProductCount = 0;
  currentPage = 1;

  constructor(private _product: ProductsService, private snackBar: MatSnackBar,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getProductList();
  }

  getProductList(page?) {
    this._product.getProductList(page ? page : 1)
      .then((data: any) => {
        if (data.length) {
          this.products = data;
          this.displayedColumns = Object.keys(this.products[0]);
          this.displayedColumns.push('Actions');
          this.calculateActiveProductCount();
          this.loaded = true;
        } else {
          if (this.currentPage > 1) {
            this.currentPage = this.currentPage - 1;
            this.getProductList(this.currentPage);
          } else {
            this.products = [];
            this.loaded = true;
          }
        }
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

  nextPage() {
    this.changePage(++this.currentPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.changePage(--this.currentPage);
    }
  }

  changePage(no) {
    this.loaded = false;
    this.currentPage = no;
    this.getProductList(this.currentPage);
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

  changeProductStatus(index) {
    this.products[index].status = this.products[index].status === '1' ? '0' : '1';
    const object = new HttpParams()
      .set('productId', this.products[index].id)
      .set('productStatus', this.products[index].status === '1' ? '0' : '1');
    this._product.changeProductStatus(object)
      .then(data => {
        const status = this.products[index].status === '0' ? 'De-activated' : 'Activated';
        this.snackBar.open('Your product has been ' + status, 'Success', {
          duration: 2000
        });
        this.calculateActiveProductCount();
      })
      .catch(err => {
        console.error(err);
        this.products[index].status = this.products[index].status === '1' ? '0' : '1';
        const error = (err.error && err.error.message) ? err.error.message : 'Internal Server Error';
        this.snackBar.open(error, 'Error', {
          duration: 2000
        });
      });
  }

  calculateActiveProductCount() {
    let tempCount = 0;
    this.products.forEach(p => {
      if (p.status === '1') {
        tempCount += 1;
      }
    });
    this.activeProductCount = tempCount;
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
