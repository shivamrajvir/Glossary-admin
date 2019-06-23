import {HttpClient} from '@angular/common/http';
import {Urls} from '../shared/urls';
import {Injectable} from '@angular/core';

@Injectable()
export class CancelService {

  constructor(private http: HttpClient) {}

  getCancelReasons() {
      return new Promise((resolve, reject) => {
        this.http.get(Urls.getCancelReason)
          .subscribe(data => {
            resolve(data);
          }, err => {
            reject(err);
          });
      });
  }

  addCancelReasons(obj) {
    return new Promise((resolve, reject) => {
      this.http.post(Urls.addCancelReason, obj)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  changeCancelReasonStatus(changedStatus) {
    return new Promise((resolve, reject) => {
      this.http.post(Urls.changeCancelReason, changedStatus)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

}
