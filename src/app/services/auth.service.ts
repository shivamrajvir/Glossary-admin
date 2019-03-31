import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Urls} from '../shared/urls';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  login(creds) {
    return new Promise((resolve, reject) => {
      this.http.post(Urls.login, creds)
        .subscribe(data => {
          localStorage.setItem('status', 'true');
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
    const token = localStorage.getItem('status');
    if (token) {
      return token.slice();
    } else {
      return null;
    }
  }

  getStatistics() {
    return new Promise((resolve, reject) => {
      return this.http.get(Urls.stats)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }
}
