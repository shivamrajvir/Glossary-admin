import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Urls} from '../shared/urls';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token;

  constructor(private http: HttpClient) { }

  login(creds) {
    return new Promise((resolve, reject) => {
      this.http.post(Urls.login, creds)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  signup(creds) {
    return new Promise((resolve, reject) => {
      this.http.post(Urls.signup, creds)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  getToken() {
    return this.token;
  }
}
