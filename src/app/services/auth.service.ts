import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Urls} from '../shared/urls';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token;

  constructor(private http: HttpClient, private router: Router) { }

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

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  // signup(creds) {
  //   return new Promise((resolve, reject) => {
  //     this.http.post(Urls.signup, creds)
  //       .subscribe(data => {
  //         resolve(data);
  //       }, err => {
  //         reject(err);
  //       });
  //   });
  // }

  getToken() {
    return this.token;
  }
}
