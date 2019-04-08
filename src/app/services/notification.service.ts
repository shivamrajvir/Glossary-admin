import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class NotficiationService {

    constructor(private http: HttpClient) {}

    getNotifications() {
        return new Promise((resolve, reject) => {
            return this.http.get()
            .subscribe();
        });
    }

    addNotification() {
      return new Promise((resolve, reject) => {
        return this.http.get(Urls.);
      });
    }

}
