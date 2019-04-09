import {Component, Inject, OnInit} from '@angular/core';
import {NotificationService} from '../../services/notification.service';
import {environment} from '../../../environments/environment';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Urls} from '../../shared/urls';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss']
})
export class NotificationSettingsComponent implements OnInit {

  notifications = [];
  loaded = false;
  displayColumns = ['id', 'title', 'image', 'validTill', 'status', 'actions'];
  imageUrl = environment.imageUrl;

  constructor(private _notifications: NotificationService, private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.getNotifications();
  }

  getNotifications() {
    this._notifications.getNotifications()
      .then((data: any) => {
        this.notifications = data;
        this.loaded = true;
      }).catch(err => {
       console.error(err);
      this.loaded = true;
    });
  }

  changeNotificationStatus() {

  }

  openAddEditNotificationModal(data?) {
    const dialogRef = this.dialog.open(AddEditNotificationModalComponent, {
      width: '600px',
      data: {
        data: data ? data : ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loaded = false;
      this.getNotifications();
    });
  }

}


@Component({
  templateUrl: 'add-edit-notification.html',
})
export class AddEditNotificationModalComponent {
  addEditNotificationForm: FormGroup;
  imageUrl = environment.imageUrl;
  isImageUploading = false;
  imageUploadFile;
  minDate = new Date();

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data,
    public snackbar: MatSnackBar, private _notification: NotificationService,
    private http: HttpClient) {
    this.initializeForm(this.data.data);
  }

  initializeForm(data?) {
    this.addEditNotificationForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      validTill: new FormControl(new Date(), Validators.required)
    });

    if (data) {
      this.addEditNotificationForm.patchValue(data);
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
    fd.append('image', name);
    fd.append('file', file);
    this.http.post(Urls.upload_product_image, fd)
      .subscribe((data: any) => {
        this.isImageUploading = false;
        this.addEditNotificationForm.controls['image'].setValue(data[0].pathName);
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
    this.addEditNotificationForm.controls['image'].setValue('');
  }

  addEditNotification() {
    this.isImageUploading = true;
    if (this.addEditNotificationForm.valid) {
      const dateFormat = this.addEditNotificationForm.value.validTill.getUTCFullYear().toString() + '-' +
        this.addEditNotificationForm.value.validTill.getUTCMonth().toString() + '-' +
        this.addEditNotificationForm.value.validTill.getUTCDate().toString();
      if (this.data.data) {
        const object = new HttpParams()
          .set('title', this.addEditNotificationForm.value.title)
          .set('description', this.addEditNotificationForm.value.description)
          .set('validTill', dateFormat)
          .set('image', this.addEditNotificationForm.value.image)
          .set('id', this.data.data.id);
        this._notification.editNotification(object)
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
          .set('title', this.addEditNotificationForm.value.title)
          .set('description', this.addEditNotificationForm.value.description)
          .set('validTill', dateFormat)
          .set('image', this.addEditNotificationForm.value.image);
        this._notification.addNotification(object)
          .then(data => {
            this.isImageUploading = false;
            this.snackbar.open('Notification Added', 'Success', {
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
      this.isImageUploading = false;
      this.snackbar.open('Please add the details for notification', 'Error', {
        duration: 4000
      });
    }
  }

}
