import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../../services/users.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  constructor(private _userService: UsersService, private router: Router) { }

  ngOnInit() {
    if (this._userService.selectedUser) {

    } else {
      this.router.navigate(['dashboard/users']);
    }
  }

}
