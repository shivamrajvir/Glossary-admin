import {Component, OnInit} from '@angular/core';
import {ReportsService} from '../../services/reports.service';
import {HttpParams} from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.scss']
})
export class PaymentReportComponent implements OnInit {

  orderStatus = 'pending';
  paymentMode = 'cod';
  fromDate = new Date();
  toDate = new Date();

  paymentReport;
  loaded = false;

  orderFromDate = new Date();
  orderToDate = new Date();
  orderPayMode = 'cod';
  oOrderStatus = 'pending';
  orderHistory = [];
  displayedColumns = ['id', 'personName', 'personPhone', 'address', 'datetime', 'payable', 'walletdeduction', 'totalprice'];


  constructor(private _reports: ReportsService, protected _datePipe: DatePipe, public snackbar: MatSnackBar) {
  }

  ngOnInit() {
    this.getReports();
    this.getOrderHistory();
  }

  getReports() {
    this.loaded = false;
    const obj = new HttpParams()
      .set('fromDate', this._datePipe.transform(this.fromDate, 'yyyy-MM-dd'))
      .set('toDate', this._datePipe.transform(this.toDate, 'yyyy-MM-dd'))
      .set('payMode', this.paymentMode)
      .set('orderstatus', this.orderStatus);
    this._reports.getPaymentReports(obj)
      .then((data: any[]) => {
        if (data && data.length) {
          this.paymentReport = data[data.length - 1];
        } else {
          this.paymentReport = {};
        }
        this.loaded = true;
      }).catch(err => {
      console.error(err);
      this.loaded = true;
    });
  }

  getOrderHistory() {
    this.loaded = false;
    const obj = new HttpParams()
      .set('fromDate', this._datePipe.transform(this.orderFromDate, 'yyyy-MM-dd'))
      .set('toDate', this._datePipe.transform(this.orderToDate, 'yyyy-MM-dd'))
      .set('payMode', this.orderPayMode)
      .set('orderstatus', this.oOrderStatus);
    this._reports.getOrderHistory(obj)
      .then((data: any[]) => {
        if (data && data.length) {
          this.orderHistory = data;
          this.orderHistory.map(o => {
            o.totalprice = parseInt(o.totalprice, 10);
            o.walletdeduction = parseInt(o.walletdeduction, 10);
          });
        } else {
          this.orderHistory = [];
        }
        this.loaded = true;
      }).catch(err => {
      console.error(err);
      this.loaded = true;
    });
  }

}
