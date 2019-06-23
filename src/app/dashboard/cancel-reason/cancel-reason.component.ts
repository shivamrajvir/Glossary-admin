import { Component, OnInit } from '@angular/core';
import {CancelService} from '../../services/cancel.service';

@Component({
  selector: 'app-cancel-reason',
  templateUrl: './cancel-reason.component.html',
  styleUrls: ['./cancel-reason.component.scss']
})
export class CancelReasonComponent implements OnInit {

  constructor(private _cancelService: CancelService) { }

  ngOnInit() {
    this.getCancellationReason();
  }

  getCancellationReason() {
    this._cancelService.getCancelReasons()
      .then(data => {
          console.log(data);
      }).catch(err => {

    });
  }

}
