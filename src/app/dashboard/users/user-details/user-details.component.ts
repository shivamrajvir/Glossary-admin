import {Component, OnInit} from '@angular/core';
import {UsersService} from '../../../services/users.service';
import {Router} from '@angular/router';
import {HttpHandler, HttpParams} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  userDetails;
  loaded = false;
  currentPage = 1;

  orderDisplayedColumns = ['id', 'name', 'status', 'price', 'datetime', 'deliverDate', 'addr', 'paymode'];
  orderList = [];

  cartData = [];
  cartDisplayedColumns = ['itemName', 'unit', 'quantity', 'price', 'datetime'];

  transactionHistory = [];
  walletDisplayedColumns = ['id', 'itemName', 'balance', 'remark', 'datetime'];
  selectedTab = 0;

  constructor(private _userService: UsersService, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    if (this._userService.selectedUser) {
      this.userDetails = this._userService.selectedUser;
      console.log(this.userDetails);
      this.getTransactionHistory();
      this.getWallet();
    } else {
      this.router.navigate(['dashboard/users']);
    }
  }

  tabChangeEvent(event) {
    this.selectedTab = event.index;
    this.currentPage = 1;
    if (event.index === 0) {
    } else if (event.index === 1) {
      this.getTransactionHistory();
      this.getWallet();
    } else if (event.index === 2) {
      this.getUserOrders(1);
    } else if (event.index === 3) {
      this.getCartDetails();
    }
    this.loaded = false;
  }

  nextPage() {
    this.changePage(++this.currentPage);
  }

  /*
     Function for going to prev page
  */
  prevPage() {
    if (this.currentPage > 1) {
      this.changePage(--this.currentPage);
    }
  }

  changePage(no) {
    this.loaded = false;
    this.currentPage = no;
    if (this.selectedTab === 0) {
    } else if (this.selectedTab === 1) {
      this.getTransactionHistory(this.currentPage);
    } else if (this.selectedTab === 2) {
      this.getUserOrders(this.currentPage);
    } else if (this.selectedTab === 3) {
      this.getCartDetails(this.currentPage);
    }
  }

  getWallet() {
    const object = new HttpParams()
      .set('uid', this.userDetails.id)
      .set('pageno', '1');
    this._userService.getWalletBalance(object)
      .then(data => {
        console.log(data);
      }).catch(err => {
      console.error(err);
    });
  }

  getTransactionHistory(page?) {
    const object = new HttpParams()
      .set('uid', this.userDetails.id)
      .set('pageno', page ? page : 1);
    this._userService.getTransactions(object)
      .then((data: any[]) => {
        console.log(data);
        if (data.length) {
          this.transactionHistory = data;
          this.loaded = true;
        } else {
          if (this.currentPage > 1) {
            this.currentPage = this.currentPage - 1;
            this.getTransactionHistory(this.currentPage);
          }
        }
      }).catch(err => {
      console.error(err);
    });
  }

  getUserOrders(page?) {
    const object = new HttpParams()
      .set('u_id', this.userDetails.id)
      .set('pageno', page ? page : 1);
    this._userService.getUserOrders(object)
      .then((data: any[]) => {
        console.log(data);
        if (data.length) {
          this.orderList = data;
          this.loaded = true;
        } else {
          if (this.currentPage > 1) {
            this.currentPage = this.currentPage - 1;
            this.getUserOrders(this.currentPage);
          }
        }
      }).catch(err => {
      this._userService.errorhandler(err);
    });
  }

  getCartDetails(page?) {
    const object = new HttpParams()
      .set('uid', this.userDetails.id)
      .set('pageno', page ? page : 1);
    this._userService.getUserCart(object)
      .then((data: any[]) => {
        console.log(data);
        if (data.length) {
          this.cartData = data;
          this.loaded = true;
        } else {
          if (this.currentPage > 1) {
            this.currentPage = this.currentPage - 1;
            this.getCartDetails(this.currentPage);
          }
        }
      }).catch(err => {
      this._userService.errorhandler(err);
    });
  }

}
