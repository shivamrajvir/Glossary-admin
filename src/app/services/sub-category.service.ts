import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Urls } from "../shared/urls";

Injectable()
export class SubCategoryService {

    constructor(private http: HttpClient) {}

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

}