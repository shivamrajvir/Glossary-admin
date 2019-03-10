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

}
