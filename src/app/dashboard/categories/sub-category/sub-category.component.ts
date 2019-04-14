import {Component, Inject, OnInit} from '@angular/core';
import {SubCategoryService} from '../../../services/sub-category.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CategoryService} from '../../../services/category.service';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductsService} from '../../../services/products.service';
import {Urls} from '../../../shared/urls';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {

  loaded = false;
  subCategories = [];
  displayedColumns = ['id', 'name', 'image', 'status', 'Actions'];
  imageUrl = environment.imageUrl;

  constructor(private _subCategory: SubCategoryService, private _category: CategoryService,
              protected snackbar: MatSnackBar, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    if (this._category.selectedCategory && this._category.selectedCategory.id) {
      this.getSubCategoryList();
    } else {
      this.router.navigate(['dashboard/categories']);
    }
  }

  getSubCategoryList() {
    const obj = new HttpParams()
      .set('catId', this._category.selectedCategory.id);
    this._subCategory.getSubCategories(obj)
      .then((data: any) => {
        this.subCategories = data.SubCategoriesDetails;
        this.loaded = true;
      }).catch(err => {
        console.error(err);
      this.loaded = true;
      this.snackbar.open('Error while fetching Sub Categories', 'Error', {
        duration: 2000
      });
    });
  }

  openAddEditSubCategoryModal(data?) {
    const dialogRef = this.dialog.open(AddEditSubCategoryModalComponent, {
      width: '600px',
      data: {
        data: data ? data : ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSubCategoryList();
    });
  }

  changeSubCategoryStatus(index) {
    this.subCategories[index].status = this.subCategories[index].status === '1' ? '0' : '1';
    const object = new HttpParams()
      .set('catId', this.subCategories[index].id)
      .set('catStatus', this.subCategories[index].status === '1' ? '0' : '1');
    this._category.changeCategoryStatus(object)
      .then(data => {
        const status = this.subCategories[index].status === '0' ? 'De-activated' : 'Activated';
        this.snackbar.open('Your Sub Category has been ' + status, 'Success', {
          duration: 2000
        });
      })
      .catch(err => {
        console.error(err);
        this.subCategories[index].status = this.subCategories[index].status === '1' ? '0' : '1';
        const error = (err.error && err.error.message) ? err.error.message : 'Internal Server Error';
        this.snackbar.open(error, 'Error', {
          duration: 2000
        });
      });
  }

}


@Component({
  templateUrl: 'add-edit-subcategory-modal.html',
})
export class AddEditSubCategoryModalComponent {
  addEditSubCategoryForm: FormGroup;
  imageUrl = environment.imageUrl;
  isImageUploading = false;
  imageUploadFile;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data,
    public snackbar: MatSnackBar, private _category: CategoryService,
    private http: HttpClient, private _subCat: SubCategoryService) {
    this.initializeForm(this.data.data ? this.data.data : null);
  }

  initializeForm(data?) {
    this.addEditSubCategoryForm = new FormGroup({
      name: new FormControl('', Validators.required),
      fileName: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      id: new FormControl('')
    });

    if (data) {
      this.addEditSubCategoryForm.controls['name'].setValue(data.name);
      this.addEditSubCategoryForm.controls['fileName'].setValue(data.image);
      this.addEditSubCategoryForm.controls['description'].setValue(data.description);
      this.addEditSubCategoryForm.controls['id'].setValue(data.id ? data.id : null);
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
        this.addEditSubCategoryForm.controls['fileName'].setValue(data[0].pathName);
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
    this.addEditSubCategoryForm.controls['fileName'].setValue('');
  }

  addEditCategory() {
    this.isImageUploading = true;
    if (this.addEditSubCategoryForm.valid) {
      if (this.data.data) {
        const object = new HttpParams()
          .set('name', this.addEditSubCategoryForm.value.name)
          .set('fileName', this.addEditSubCategoryForm.value.fileName)
          .set('description', this.addEditSubCategoryForm.value.description)
          .set('c_id', this._category.selectedCategory.id)
          .set('id', this.addEditSubCategoryForm.value.id);
        this._subCat.editSubCategory(object)
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
          .set('name', this.addEditSubCategoryForm.value.name)
          .set('description', this.addEditSubCategoryForm.value.description)
          .set('fileName', this.addEditSubCategoryForm.value.fileName)
          .set('c_id', this._category.selectedCategory.id);
        this._subCat.addSubCategory(object)
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
