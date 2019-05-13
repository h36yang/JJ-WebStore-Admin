import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AppSettings } from './app.settings';
import { LoginToken } from './login/login-token';
import { Product } from './products/product';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseApi: string;
  sharedHttpOptions: object;

  constructor(private http: HttpClient) {
    this.baseApi = AppSettings.API_BASE_URL;
    this.sharedHttpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json'
      }),
      responseType: 'json'
    };
  }

  userLogin(username: string, password: string): Observable<LoginToken> {
    const url = `${this.baseApi}Users/authenticate?username=${username}&password=${password}`;
    return this.http.post<LoginToken>(url, this.sharedHttpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllProducts(): Observable<Product[]> {
    const url = `${this.baseApi}Products`;
    return this.http.get<Product[]>(url, this.sharedHttpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteProduct(id: number): Observable<any> {
    const url = `${this.baseApi}Products/${id}`;
    return this.http.delete(url, this.sharedHttpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  recoverProduct(id: number): Observable<any> {
    const url = `${this.baseApi}Products/Activate/${id}`;
    return this.http.put(url, this.sharedHttpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, body was: \n${JSON.stringify(error, null, 2)}`);
    }
    // return an observable with a user-facing error message
    if (error.error) {
      return throwError(error.error.message);
    } else if (error.message) {
      return throwError(error.message);
    } else {
      return throwError('Something bad happened; please try again later.');
    }
  }
}
