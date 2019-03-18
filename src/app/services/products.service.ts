import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Urls} from '../shared/urls';

@Injectable()
export class ProductsService {

  constructor(private http: HttpClient) {}

  getProductList() {
    return new Promise((resolve, reject) => {
      return this.http.get(Urls.product)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  addProduct(object) {
    return new Promise((resolve, reject) => {
      return this.http.post(Urls.add_product, object)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  editProduct(object) {
    return new Promise((resolve, reject) => {
      return this.http.post(Urls.edit_product, object)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

}
