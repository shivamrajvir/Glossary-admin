import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Urls} from '../shared/urls';

@Injectable()
export class SubCategoryService {

  subCategoryDetails;

  constructor(private http: HttpClient) {
  }

  getSubCategories(id) {
    return new Promise((resolve, reject) => {
      return this.http.post(Urls.get_subcategories, id)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  changeSubCatStatus(id) {
    return new Promise((resolve, reject) => {
      return this.http.post(Urls.changeSubCatStatus, id)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  addSubCategory(obj) {
    return new Promise((resolve, reject) => {
      return this.http.post(Urls.add_subcategories, obj)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  editSubCategory(obj) {
    return new Promise((resolve, reject) => {
      return this.http.post(Urls.edit_subcategories, obj)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  addSubCategoryDetails(obj) {
    return new Promise((resolve, reject) => {
      return this.http.post(Urls.add_subcat_details, obj)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  editSubCategoryDetails(obj) {
    return new Promise((resolve, reject) => {
      return this.http.post(Urls.edit_subcat_details, obj)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  changeSubCategoryDetailStatus(obj) {
    return new Promise((resolve, reject) => {
      return this.http.post(Urls.change_subcat_details, obj)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  getUnits() {
    return new Promise((resolve, reject) => {
      return this.http.get(Urls.get_units)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  addUnit(obj) {
    return new Promise((resolve, reject) => {
      return this.http.post(Urls.add_unit, obj)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

  changeUnitStatus(obj) {
    return new Promise((resolve, reject) => {
      return this.http.post(Urls.change_unit_status, obj)
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        });
    });
  }

}
