import {Component, Inject, OnInit} from '@angular/core';
import {SliderService} from '../../services/slider.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {environment} from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AddEditProductModalComponent} from '../products/products.component';
import {ProductsService} from '../../services/products.service';
import {Urls} from '../../shared/urls';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

  sliderCustomOptions: any = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    center: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  };

  sliderList = [];
  loaded = false;
  imageUrl = environment.imageUrl;

  constructor(private _sliderService: SliderService, private snackBar: MatSnackBar, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.refreshSliders();
  }

  refreshSliders() {
    this._sliderService.getDashboardSliders()
      .subscribe(data => {
        console.log(data);
        this.sliderList = data;
        this.loaded = true;
      }, err => {
        console.error(err);
        this.loaded = true;
        const error = (err.error && err.error.message) ? err.error.message : 'Internal Server Error';
        this.snackBar.open(error, 'Error', {
          duration: 2000
        });
      });
  }

  deleteSlider(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.deleteSelectedSlider(id);
      }
    });
  }

  deleteSelectedSlider(id) {
    const body = new HttpParams()
      .set('id', id);
    this._sliderService.deleteSlider(body)
      .subscribe(data => {
        console.log(data);
        this.refreshSliders();
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      }, err => {
        console.error(err);
      });
  }

  openAddSliderModal() {
    const dialogRef = this.dialog.open(addSliderModal, {
      width: '600px'
    });

    dialogRef.afterClosed()
      .subscribe(result => {
      this.refreshSliders();
    });
  }

}


@Component({
  templateUrl: 'add-slider.html',
})
export class addSliderModal {

  isImageUploading = false;
  imageUploadFile;
  imageFileName;
  imageUrl = environment.imageUrl;

  constructor(public dialogRef: MatDialogRef<any>, public snackbar: MatSnackBar, private http: HttpClient) {}

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

  deleteImage() {
    this.imageFileName = '';
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
