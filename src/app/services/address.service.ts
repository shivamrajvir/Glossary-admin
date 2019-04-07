import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Urls} from '../shared/urls';

@Injectable()
export class AddressService {

  constructor(private http: HttpClient) {}

  getStates() {
    return new Promise((resolve, reject) => {
      return this.http.get(Urls.get_states)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  getCities(id) {
    return new Promise((resolve, reject) => {
      return this.http.post(Urls.get_cities, id)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  addCity(object) {
    return new Promise((resolve, reject) => {
      return this.http.post(Urls.add_city, object)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

}
