import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../services/users.service';
import {HttpParams} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  currentPage = 1;
  loaded = false;
  userList = [];
  displayedColumns = ['id', 'name', 'email', 'phone', 'datetime', 'isLogin', 'status', 'actions'];

  constructor(private _userService: UsersService, private snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(page?) {
    this._userService.getUsers(page ? page : 1)
      .then((data: any[]) => {
        console.log(data);
        if (data.length) {
          this.userList = data;
          this.loaded = true;
        } else {
          if (this.currentPage > 1) {
            this.getUsers(--this.currentPage);
          } else {
            this.userList = [];
          this.loaded = true;
          }
        }
      }).catch(err => {
        console.error(err);
    });
  }

  changeUserStatus(index) {
    this.userList[index].status = this.userList[index].status === '1' ? '0' : '1';
    const object = new HttpParams()
      .set('id', this.userList[index].id)
      .set('status', this.userList[index].status === '1' ? '0' : '1');
    this._userService.changeUserStatus(object)
      .then(data => {
        const status = this.userList[index].status === '0' ? 'De-activated' : 'Activated';
        this.snackBar.open('Your User has been ' + status, 'Success', {
          duration: 2000
        });
      }).catch(err => {
        console.error(err);
        this.userList[index].status = this.userList[index].status === '1' ? '0' : '1';
        const error = (err.error && err.error.message) ? err.error.message : 'Internal Server Error';
        this.snackBar.open(error, 'Error', {
          duration: 2000
        });
      });
  }

  changeUserLoginStatus(index) {
    this.userList[index].islogin = this.userList[index].islogin === '1' ? '0' : '1';
    const object = new HttpParams()
      .set('id', this.userList[index].id)
      .set('islogin', this.userList[index].islogin === '1' ? '0' : '1');
    this._userService.changeUserLogin(object)
      .then(data => {
        const status = this.userList[index].islogin === '0' ? 'logged out' : 'Logged In';
        this.snackBar.open('Your User has been ' + status, 'Success', {
          duration: 2000
        });
      }).catch(err => {
      console.error(err);
      this.userList[index].islogin = this.userList[index].islogin === '1' ? '0' : '1';
      const error = (err.error && err.error.message) ? err.error.message : 'Internal Server Error';
      this.snackBar.open(error, 'Error', {
        duration: 2000
      });
    });
  }

  openUserDetailPage(user) {
    this._userService.selectedUser = user;
    this.router.navigate(['dashboard/users/user-details']);
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
    this.getUsers(this.currentPage);
  }

}
