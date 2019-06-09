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
  displayedColumns = ['id', 'name', 'email', 'phone', 'datetime', 'status', 'actions'];

  constructor(private _userService: UsersService, private snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(page?) {
    this._userService.getUsers(page ? page : 1)
      .then((data: any[]) => {
        console.log(data);
        this.userList = data;
        this.loaded = true;
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

  openUserDetailPage(user) {
    this._userService.selectedUser = user;
    this.router.navigate(['dashboard/users/user-details']);
  }

}
