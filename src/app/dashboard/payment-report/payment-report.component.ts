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

  constructor(private _reports: ReportsService, protected _datePipe: DatePipe, public snackbar: MatSnackBar) {
  }

  ngOnInit() {
    this.getReports();
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

}
