import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Urls} from '../shared/urls';

@Injectable()
export class NotificationService {

    constructor(private http: HttpClient) {}

    getNotifications() {
        return new Promise((resolve, reject) => {
            return this.http.get(Urls.get_notification)
            .subscribe(data => {
              resolve(data);
            }, err => {
              reject(err);
            });
        });
    }

    addNotification(object) {
      return new Promise((resolve, reject) => {
        return this.http.post(Urls.add_notification, object)
          .subscribe(data => {
            resolve(data);
          }, err => {
            reject(err);
          });
      });
    }

    editNotification(object) {
      return new Promise((resolve, reject) => {
        return this.http.post(Urls.edit_notification, object)
          .subscribe(data => {
            resolve(data);
          }, err => {
            reject(err);
          });
      });
    }

    deleteNotif(obj) {
      return new Promise((resolve, reject) => {
        return this.http.post(Urls.delete_notification, obj)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
      });
    }

}
