import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  statistics;
  loaded = false;
  dailyOrders;

  orderDisplayedColumns = ['id', 'name', 'status', 'price', 'datetime', 'phone', 'addr', 'paymode'];
  orderList = [];

  constructor(private _auth: AuthService, private datePipe: DatePipe, private _router: Router) { }

  ngOnInit() {
    this.getStatistics();
    this.getOrdersStats();
  }

  getStatistics() {
    this._auth.getStatistics()
      .then(data => {
        this.loaded = true;
        this.statistics = data[0];
      })
      .catch(err => {
        console.error(err);
        this.loaded = true;
      });
  }

  getOrdersStats() {
    const obj = new HttpParams()
      // .set('deliveryDate', this.datePipe.transform(new Date(), 'yyyy-mm-dd'));
      .set('deliveryDate', '2019-06-08');
    this._auth.getOrderStats(obj)
      .then((data: any[]) => {
        this.loaded = true;
        if (data && data.length) {
          this.orderList = data;
          this.dailyOrders = (data && data.length) ? data.length : 0;
        } else {
          this.orderList = [];
          this.dailyOrders = 0;
        }
      })
      .catch(err => {
        console.error(err);
        this.loaded = true;
      });
  }

  goToOrderDetails(data) {
      this._router.navigate(['dashboard/reports/orderDetails/' + data.id]);
  }

}
