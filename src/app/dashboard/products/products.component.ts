import { Component, OnInit } from '@angular/core';
import {ProductsService} from '../../services/products.service';
import {SnotifyService} from 'ng-snotify';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  loaded = false;
  products = [];
  displayedColumns = [];
  imageUrl = 'https://crazeoftech.000webhostapp.com/ecommerce/images/';

  constructor(private _product: ProductsService, private snotify: SnotifyService) { }

  ngOnInit() {
    this.getProductList();
  }

  getProductList() {
    this._product.getProductList()
      .then((data: any) => {
        console.log(data);
        this.products = data;
        this.displayedColumns = Object.keys(this.products[0]);
        this.loaded = true;
      })
      .catch(err => {
        console.error(err);
        this.loaded = true;
        const error = (err.error && err.error.message) ? err.error.message : 'Internal Server Error';
        this.snotify.error('Error: ' + error);
      });
  }
}
