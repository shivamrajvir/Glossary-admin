import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Urls} from '../shared/urls';

@Injectable()
export class UsersService {

  selectedUser;

  constructor(private http: HttpClient) {}

  getUsers(page) {
    return new Promise((resolve, reject) => {
      this.http.get(Urls.get_users + '?pageno=' + page)
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  changeUserStatus(obj) {
    return new Promise((resolve, reject) => {
      this.http.post(Urls.change_user_status, obj)
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
}

