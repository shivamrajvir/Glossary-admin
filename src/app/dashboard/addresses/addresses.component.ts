import { Component, OnInit, Inject } from '@angular/core';
import {AddressService} from '../../services/address.service';
import {MatSnackBar, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {

  isLoading = true;
  cities = [];
  displayedColumns = ['id', 'name'];

  constructor(private _addressService: AddressService, protected snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getStates();
  }

  getStates() {
    this._addressService.getStates()
      .then(data => {
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
        this.isLoading = false;
        this.cities = data;
      })
      .catch(err => {
        this.isLoading = false;
        console.error(err);
        const error = (err.error && err.error.error && err.error.error.message) ? err.error.error.message : 'Internal Server Error';
        this.snackBar.open(error, 'Error', {
          duration: 2000
        });
      });
  }

  changeCityStatus(index) {

  }

  addCity() {

  }

}

@Component({
  templateUrl: 'add-city.html',
})
export class AddCityModalComponent {
  
cityForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data,) {
      this.initializeForm(data.data);
    }

    initializeForm(data?) {
        this.cityForm = new FormGroup({
          cityName: new FormControl(null, Validators.required),
          stateId: new FormControl(null, Validators.required),
        });

        if (data) {
          this.cityForm.patchValue(data);
        }
    }

    addCity() {
        if (this.cityForm.valid) {
          
        }
    }

}
