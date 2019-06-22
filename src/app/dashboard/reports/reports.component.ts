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

  orderDisplayedColumns = ['id', 'name', 'price', 'datetime', 'phone', 'addr', 'paymode', 'status'];
  orderList = [];

  selectedDate = new Date();

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

  getOrdersStats(date?) {
    let obj;
    if (date) {
      this.selectedDate = new Date(date.value);
      console.log(this.selectedDate);
      obj = new HttpParams()
        .set('deliveryDate', this.datePipe.transform(date.value, 'yyyy-MM-dd'));
      // .set('deliveryDate', '2019-06-08');
    } else {
      obj = new HttpParams()
        .set('deliveryDate', this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
      // .set('deliveryDate', '2019-06-08');
    }
    this._auth.getOrderStats(obj)
      .then((data: any[]) => {
        this.loaded = true;
        if (data && data.length) {
          this.orderList = data;
          this.orderList = this.orderList.filter(order => {
            return (order.orderstatus === 'pending');
          });
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

  orderStatusChange(order) {
    this.loaded = false;
    const obj = new HttpParams()
      .set('id', order.id);

      this._auth.completeOrderStatus(obj)
      .then(data => {
        this.getOrdersStats({value: this.selectedDate});
      })
      .catch(err => {
        console.error(err);
      });
  }

}
