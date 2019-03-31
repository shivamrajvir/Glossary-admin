import { Component, OnInit } from '@angular/core';
import {AddressService} from '../../services/address.service';
import {MatSnackBar} from '@angular/material';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {

  isLoading = true;

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
      .then(data => {
        this.isLoading = false;
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

}
