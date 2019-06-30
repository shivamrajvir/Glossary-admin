import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Urls} from '../shared/urls';

@Injectable()
export class ReportsService {

  constructor(private http: HttpClient) {}

  getPaymentReports(obj) {
    return new Promise((resolve, reject) => {
      this.http.post(Urls.payment_report, obj)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

}
