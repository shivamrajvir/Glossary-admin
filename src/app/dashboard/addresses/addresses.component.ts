import {Component, OnInit, Inject} from '@angular/core';
import {AddressService} from '../../services/address.service';
import {MatSnackBar, MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material';
import {HttpParams} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {

  loaded = false;
  states = [];
  cities = [];
  displayedColumns = ['id', 'name', 'Actions'];
  displayStateColumns = ['id', 'name', 'Actions'];

  constructor(private _addressService: AddressService, protected snackBar: MatSnackBar,
              protected dialog: MatDialog) {
  }

  ngOnInit() {
    this.getStates();
  }

  getStates() {
    this._addressService.getStates()
      .then((data: any) => {
        this.states = data;
        this.getCities(data[0].id);
      })
      .catch(err => {
        console.error(err);
        const error = (err.error && err.error.error && err.error.error.message) ? err.error.error.message : 'Internal Server Error';
        this.snackBar.open(error, 'Error', {
          duration: 2000
        });
      });
  }

  getCities(id) {
    const object = new HttpParams()
      .set('stateId', id);
    this._addressService.getCities(object)
      .then((data: any) => {
        this.loaded = true;
        this.cities = data;
      })
      .catch(err => {
        this.loaded = true;
        console.error(err);
        const error = (err.error && err.error.error && err.error.error.message) ? err.error.error.message : 'Internal Server Error';
        this.snackBar.open(error, 'Error', {
          duration: 2000
        });
      });
  }
  
  changeStateStatus(data, index) {
    this.states[index].status = this.states[index].status === '1' ? '0' : '1';
    const object = new HttpParams()
      .set('stateId', data.id)
      .set('stateStatus', data.status === '1' ? '0' : '1');
    this._addressService.changeStateStatus(object)
      .then(data => {
        const status = this.cities[index].status === '0' ? 'De-activated' : 'Activated';
        this.snackBar.open('Your State has been ' + status, 'Success', {
          duration: 2000
        });
      })
      .catch(err => {
        console.error(err);
        this.states[index].status = this.states[index].status === '1' ? '0' : '1';
        const error = (err.error && err.error.error && err.error.error.message) ? err.error.error.message : 'Internal Server Error';
        this.snackBar.open(error, 'Error', {
          duration: 2000
        });
      });
  }

  addState() {
    const dialogRef = this.dialog.open(AddCityModalComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getStates();
    });
  }

  changeCityStatus(data, index) {
    this.cities[index].status = this.cities[index].status === '1' ? '0' : '1';
    const object = new HttpParams()
      .set('cityId', data.id)
      .set('cityStatus', data.status === '1' ? '0' : '1');
    this._addressService.changeCityStatus(object)
      .then(data => {
        const status = this.cities[index].status === '0' ? 'De-activated' : 'Activated';
        this.snackBar.open('Your City has been ' + status, 'Success', {
          duration: 2000
        });
      })
      .catch(err => {
        console.error(err);
        this.cities[index].status = this.cities[index].status === '1' ? '0' : '1';
        const error = (err.error && err.error.error && err.error.error.message) ? err.error.error.message : 'Internal Server Error';
        this.snackBar.open(error, 'Error', {
          duration: 2000
        });
      });
  }

  addCity() {
    const dialogRef = this.dialog.open(AddCityModalComponent, {
      width: '600px',
      data: {
        states: this.states
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getStates();
    });
  }

}

@Component({
  templateUrl: 'add-city.html',
})
export class AddCityModalComponent {

  cityForm: FormGroup;
  stateList = [];
  stateForm: FormGroup;
  isCity = false;

  constructor(public dialogRef: MatDialogRef<any>, public snackbar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data, public _address: AddressService) {
    this.stateList = data.states;
    if (this.stateList) {
      this.isCity = true;
      this.initializeForm();
    } else {
      this.isCity = false;
      this.initializeStateForm();
    }
  }

  initializeForm() {
    this.cityForm = new FormGroup({
      cityName: new FormControl(null, Validators.required),
      stateId: new FormControl(null, Validators.required),
    });
  }

  initializeStateForm() {
    this.stateForm = new FormGroup({
      stateName: new FormControl(null, Validators.required)
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  addCity() {
    if (this.cityForm.valid) {
      const object = new HttpParams()
        .set('stateId', this.cityForm.value.stateId)
        .set('cityName', this.cityForm.value.cityName);
      this._address.addCity(object)
        .then(data => {
          this.closeModal();
          this.snackbar.open('Your City has been added', 'Success', {
            duration: 2000
          });
        }).catch(err => {
        console.error(err);
        this.snackbar.open('Please add all the details', 'Error', {
          duration: 2000
        });
      });
    } else {
      this.snackbar.open('Please add all the details', 'Error', {
        duration: 2000
      });
    }
  }

  addState() {
    if (this.stateForm.valid) {
      const object = new HttpParams()
        .set('stateName', this.stateForm.value.stateName);
      this._address.addState(object)
        .then(data => {
          this.closeModal();
          this.snackbar.open('Your State has been added', 'Success', {
            duration: 2000
          });
        }).catch(err => {
        console.error(err);
        this.snackbar.open('Please add all the details', 'Error', {
          duration: 2000
        });
      });
    } else {
      this.snackbar.open('Please add State Name', 'Error', {
        duration: 2000
      });
    }
  }

}
