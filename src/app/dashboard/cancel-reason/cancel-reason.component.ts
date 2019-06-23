import {Component, Inject, OnInit} from '@angular/core';
import {CancelService} from '../../services/cancel.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {HttpParams} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AddressService} from '../../services/address.service';
import {AddCityModalComponent} from '../addresses/addresses.component';

@Component({
  selector: 'app-cancel-reason',
  templateUrl: './cancel-reason.component.html',
  styleUrls: ['./cancel-reason.component.scss']
})
export class CancelReasonComponent implements OnInit {

  loaded = false;
  reasons: any = [];
  displayedColumns = ['id', 'name', 'datetime', 'status', 'actions'];

  constructor(private _cancelService: CancelService, public snackBar: MatSnackBar,
              protected dialog: MatDialog) { }

  ngOnInit() {
    this.getCancellationReason();
  }

  getCancellationReason() {
    this._cancelService.getCancelReasons()
      .then(data => {
          this.reasons = data;
          this.loaded = true;
      }).catch(err => {
      console.error(err);
      this.loaded = true;
      const error = (err.error && err.error.message) ? err.error.message : 'Internal Server Error';
      this.snackBar.open(error, 'Error', {
        duration: 2000
      });
    });
  }

  changeReasonStatus(index) {
    this.reasons[index].status = this.reasons[index].status === '1' ? '0' : '1';
    const object = new HttpParams()
      .set('id', this.reasons[index].id)
      .set('status', this.reasons[index].status === '1' ? '0' : '1');
    this._cancelService.changeCancelReasonStatus(object)
      .then(data => {
        const status = this.reasons[index].status === '0' ? 'De-activated' : 'Activated';
        this.snackBar.open('Your Cancel reason has been ' + status, 'Success', {
          duration: 2000
        });
      })
      .catch(err => {
        console.error(err);
        this.reasons[index].status = this.reasons[index].status === '1' ? '0' : '1';
        const error = (err.error && err.error.message) ? err.error.message : 'Internal Server Error';
        this.snackBar.open(error, 'Error', {
          duration: 2000
        });
      });
  }

  openAddReasonModal() {
    const dialogRef = this.dialog.open(AddEditCancelReasonModalComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCancellationReason();
    });
  }

}


@Component({
  templateUrl: 'cancel-reason.html',
})
export class AddEditCancelReasonModalComponent {

  cancelReasonForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<any>, public snackbar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data, public _cancelService: CancelService) {
    this.initializeForm();
  }

  initializeForm() {
    this.cancelReasonForm = new FormGroup({
      name: new FormControl(null, Validators.required)
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  addReason() {
    if (this.cancelReasonForm.valid && this.cancelReasonForm.value.name && this.cancelReasonForm.value.name.trim()) {
      const object = new HttpParams()
        .set('name', this.cancelReasonForm.value.name);
      this._cancelService.addCancelReasons(object)
        .then(data => {
          this.closeModal();
          this.snackbar.open('Your Reason has been added', 'Success', {
            duration: 2000
          });
        }).catch(err => {
        console.error(err);
        this.snackbar.open('Please add all the details', 'Error', {
          duration: 4000
        });
      });
    } else {
      this.snackbar.open('Please add all the details', 'Error', {
        duration: 4000
      });
    }
  }

}
