import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Urls} from '../shared/urls';
import {subscribeOn} from 'rxjs/operators';

@Injectable()
export class CategoryService {

  constructor(private http: HttpClient) {}

  addCategory(object) {
    return new Promise((resolve, reject) => {
      return this.http.post(Urls.add_category, object)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  editCategory(object) {
    return new Promise((resolve, reject) => {
      return this.http.post(Urls.edit_category, object)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  getCategoriesByProductID(object) {
    return new Promise((resolve, reject) => {
      return this.http.post(Urls.get_category, object)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  changeCategoryStatus(object) {
    return new Promise((resolve, reject) => {
      return this.http.post(Urls.changeStatus_category, object)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }
}
