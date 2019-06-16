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

  walletDetails;
  isEditBalance = false;
  editBalance = {
    id: '',
    operation: '',
    amount: 0,
    reason: '',
    mobileNo: 0
  };

  constructor(private _userService: UsersService, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    if (this._userService.selectedUser) {
      this.userDetails = this._userService.selectedUser;
      this.getWallet();
    } else {
      this.router.navigate(['dashboard/users']);
    }
  }

  editWalletBalance() {
    this.isEditBalance = !this.isEditBalance;
    if (this.isEditBalance) {
      this.editBalance = {
        id: this.walletDetails.id,
        operation: 'add',
        amount: 0,
        reason: '',
        mobileNo: this.userDetails.phone
      };
    }
  }

  editUserWallet() {
    if (this.editBalance.amount <= 0) {
      this.snackBar.open('Error', 'Amount must be greater than zero', {
        duration: 4000
      });
      return;
    }

    if (!this.editBalance.reason) {
      this.snackBar.open('Error', 'Please give a reason', {
        duration: 4000
      });
      return;
    }
\
    if (this.editBalance.amount > parseInt(this.walletDetails.currentbalance, 10) && this.editBalance.operation === 'deduct') {
      this.snackBar.open('Error', 'Deduction money is more than current balance', {
        duration: 4000
      });
      return;
    }

    const object = new HttpParams()
      .set('id', this.editBalance.id)
      .set('operation', this.editBalance.operation)
      .set('amount', this.editBalance.amount.toString())
      .set('reason', this.editBalance.reason)
      .set('mobileNo', this.editBalance.mobileNo.toString());

    this._userService.editUserWallet(object)
      .then(data => {
        console.log(data);
        this.getWallet();
        this.isEditBalance = false;
        this.snackBar.open('Success', 'Wallet balance has been changed', {
          duration: 4000
        });
      }).catch(err => {
      console.error(err);
    });
  }

  tabChangeEvent(event) {
    this.selectedTab = event.index;
    this.currentPage = 1;
    if (event.index === 0) {
      this.getWallet();
    } else if (event.index === 1) {
      this.getTransactionHistory();
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
      .set('uid', this.userDetails.id);
    this._userService.getWalletBalance(object)
      .then((data: any[]) => {
        console.log(data);
        this.walletDetails = data.length ? data[0] : 0;
        this.loaded = true;
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
        this.loaded = true;
        if (data.length) {
          this.transactionHistory = data;
        } else {
          if (this.currentPage > 1) {
            this.currentPage = this.currentPage - 1;
            this.getTransactionHistory(this.currentPage);
          } else {
            this.transactionHistory = [];
            this.loaded = true;
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
          } else {
            this.orderList = [];
            this.loaded = true;
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
          } else {
            this.cartData = [];
            this.loaded = true;
          }
        }
      }).catch(err => {
      this._userService.errorhandler(err);
    });
  }

  restrictInputNumbers(e) {
    if (e.keyCode === 43 || e.keyCode === 101 || e.keyCode === 45 || e.keyCode === 46) {
      e.preventDefault();
    }
  }

  goToOrderDetails(row) {
    console.log(row);
    this.router.navigate(['dashboard/users/user-details/order-details/' + row.masterOrderId]);
  }

}
