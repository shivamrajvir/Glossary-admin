import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from '../../../../services/users.service';
import {HttpParams} from '@angular/common/http';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  masterOrderId;
  orderDetails = [];
  cancelledItems = [];
  loaded = false;
  displayedColumns = ['id', 'name', 'quantity', 'price'];
  selectedTab = 0;

  exportAsConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementId: 'text', // the id of html/table element
  };
  totalAmount = 0;

  constructor(private route: ActivatedRoute, private _users: UsersService, private router: Router,
              private exportAsService: ExportAsService, private _datepipe: DatePipe) { }

  ngOnInit() {
    if (!this._users.masterOrder) {
      this.router.navigate(['dashboard']);
    }
    if (this.route.snapshot.params.id) {
      this.masterOrderId = this.route.snapshot.params.id;
      const obj = new HttpParams()
        .set('mid', this.masterOrderId)
        .set('pageno', '1');

      this._users.getOrderDetailsById(obj)
        .then((data: any[]) => {
          if (data.length) {
            this.orderDetails = data.filter(d => {
              return (d.status === '1');
            });
            this.totalAmount = 0;
            this.orderDetails.forEach(order => {
              console.log(parseInt(order.price, 10));
              this.totalAmount += parseInt(order.price, 10);
            });
            this.cancelledItems = data.filter(d => {
              return (d.status === '0');
            });
          } else {
            this.orderDetails = [];
            this.cancelledItems = [];
          }
          this.loaded = true;
        }).catch(err => {
          console.error(err);
      });

    } else {
      this.router.navigate(['dashboard/users']);
    }
  }

  tabChangeEvent(event) {
    this.selectedTab = event.index;
    // this.currentPage = 1;
    // if (event.index === 0) {
    //   this.getWallet();
    // } else if (event.index === 1) {
    //   this.getTransactionHistory();
    // } else if (event.index === 2) {
    //   this.getUserOrders(1);
    // } else if (event.index === 3) {
    //   this.getCartDetails();
    // }
    // this.loaded = false;
  }

  downloadPDF() {
    const date = this._datepipe.transform(this.orderDetails[0].datetime, 'dd_MM_yyyy');
    const name = this._users.masterOrder.deliveryPersonName;
    const fileName = name + '_' + date;
    this.exportAsService.save(this.exportAsConfig, fileName);

  }

}
