import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  statistics;
  loaded = false;
  dailyOrders;

  constructor(private _auth: AuthService, private datePipe: DatePipe) { }

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
    console.log(this.datePipe.transform(new Date(), 'yyyy-mm-dd'));
    const obj = new HttpParams()
      .set('deliveryDate', this.datePipe.transform(new Date(), 'yyyy-mm-dd'));
    this._auth.getOrderStats(obj)
      .then((data: any[]) => {
        this.loaded = true;
        this.dailyOrders = (data && data.length) ? data.length : 0;
      })
      .catch(err => {
        console.error(err);
        this.loaded = true;
      });
  }

}
