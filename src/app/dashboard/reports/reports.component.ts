import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  statistics;
  loaded = false;

  constructor(private _auth: AuthService) { }

  ngOnInit() {
    this.getStatistics();
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

}
