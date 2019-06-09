import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../../services/users.service';
import {Router} from '@angular/router';
import {HttpHandler, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  userDetails;
  loaded = false;
  currentPage = 1;

  constructor(private _userService: UsersService, private router: Router) { }

  ngOnInit() {
    if (this._userService.selectedUser) {
      this.userDetails = this._userService.selectedUser;
      console.log(this.userDetails);
    } else {
      this.router.navigate(['dashboard/users']);
    }
  }

  tabChangeEvent(event) {
    console.log(event);
    if (event.index === 0) {

    } else if (event.index === 1) {
      this.getUserOrders(1);
    } else if (event.index === 2) {
      this.getCartDetails();
    }
  }

  getTransactionHistory() {
    this._userService.getTransactions()
      .then(data => {
        console.log(data);
      }).catch(err => {
        console.error(err);
    });
  }

  getUserOrders(page?) {
    const object = new HttpParams()
      .set('u_id', this.userDetails.id)
      .set('pageno', page ? page : 1);
    this._userService.getUserOrders(object)
      .then(data => {

      });
  }

  getCartDetails(page?) {
    const object = new HttpParams()
      .set('uid', this.userDetails.id)
      .set('pageno', page ? page : 1);
    this._userService.getUserCart(object)
      .then(data => {

      });
  }

}
