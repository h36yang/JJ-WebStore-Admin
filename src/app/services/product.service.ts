import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Product } from '../products/product';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseApi: string;
  sharedHttpOptions: object;

  constructor(private http: HttpClient, private shared: SharedService) {
    this.baseApi = environment.baseApi;
    this.sharedHttpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json'
      }),
      responseType: 'json'
    };
  }

  getAllProducts(): Observable<Product[]> {
    const url = `${this.baseApi}Products`;
    return this.http.get<Product[]>(url, this.sharedHttpOptions)
      .pipe(
        catchError(this.shared.handleHttpError)
      );
  }

  getProduct(id: number): Observable<Product> {
    const url = `${this.baseApi}Products/${id}`;
    return this.http.get<Product>(url, this.sharedHttpOptions)
      .pipe(
        catchError(this.shared.handleHttpError)
      );
  }

  deleteProduct(id: number): Observable<any> {
    const url = `${this.baseApi}Products/${id}`;
    return this.http.delete(url, this.sharedHttpOptions)
      .pipe(
        catchError(this.shared.handleHttpError)
      );
  }

  recoverProduct(id: number): Observable<any> {
    const url = `${this.baseApi}Products/Activate/${id}`;
    return this.http.put(url, this.sharedHttpOptions)
      .pipe(
        catchError(this.shared.handleHttpError)
      );
  }
}
