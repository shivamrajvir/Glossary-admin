import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Urls} from '../shared/urls';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class UsersService {

  selectedUser;
  masterOrder;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

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

  changeUserLogin(obj) {
    return new Promise((resolve, reject) => {
      this.http.post(Urls.change_user_login_status, obj)
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getTransactions(obj) {
    return new Promise((resolve, reject) => {
      this.http.post(Urls.cart_balance, obj)
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getUserOrders(obj) {
    return new Promise((resolve, reject) => {
      this.http.post(Urls.user_orders, obj)
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getUserCart(obj) {
    return new Promise((resolve, reject) => {
      this.http.post(Urls.user_cart, obj)
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getWalletBalance(obj) {
    return new Promise((resolve, reject) => {
      this.http.post(Urls.wallet_balance, obj)
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  editUserWallet(obj) {
    return new Promise((resolve, reject) => {
      this.http.post(Urls.edit_wallet_balance, obj)
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getOrderDetailsById(obj) {
    return new Promise((resolve, reject) => {
      this.http.post(Urls.get_orders, obj)
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  errorhandler(error) {
    console.error(error);
    const message = (error.error && error.error.error && error.error.error.error ) ? error.error.error.error : 'Internal Server Error';
    this.snackBar.open('Error', message, {
      duration: 4000
    });
  }

}

