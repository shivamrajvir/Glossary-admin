import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Urls} from '../shared/urls';

@Injectable()
export class SliderService {

  constructor(private http: HttpClient) {
  }

  getDashboardSliders() {
    return Observable.create((observer) => {
      return this.http.get(Urls.get_slider)
        .subscribe(data => {
          observer.next(data);
        }, err => {
          observer.error(err);
        });
    });
  }

  addDashboardSlider(object) {
    return Observable.create((observer) => {
      return this.http.post(Urls.add_slider, object)
        .subscribe(data => {
          observer.next(data);
        }, err => {
          observer.error(err);
        });
    });
  }

  deleteSlider(object) {
    return Observable.create((observer) => {
      return this.http.post(Urls.delete_slidder, object, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .subscribe(data => {
          observer.next(data);
        }, err => {
          observer.error(err);
        });
    });
  }

}
