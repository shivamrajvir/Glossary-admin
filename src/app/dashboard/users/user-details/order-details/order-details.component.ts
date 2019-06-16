import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from '../../../../services/users.service';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  masterOrderId;
  orderDetails = [];
  loaded = false;
  displayedColumns = ['id', 'name', 'quantity', 'status', 'price', 'datetime'];

  constructor(private route: ActivatedRoute, private _users: UsersService, private router: Router) { }

  ngOnInit() {
    if (this.route.snapshot.params.id) {
      this.masterOrderId = this.route.snapshot.params.id;
      const obj = new HttpParams()
        .set('mid', this.masterOrderId)
        .set('pageno', '1');

      this._users.getOrderDetailsById(obj)
        .then((data: any[]) => {
          this.orderDetails = data;
          this.loaded = true;
        }).catch(err => {
          console.error(err);
      });

    } else {
      this.router.navigate(['dashboard/users']);
    }
  }

}
