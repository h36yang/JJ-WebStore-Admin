import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LoginToken } from './login/login-token';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseApi: string;

  constructor(private http: HttpClient) {
    this.baseApi = 'https://zcteaapi.azurewebsites.net/api/';
  }

  userLogin(username: string, password: string): Observable<LoginToken> {
    const url = `${this.baseApi}Users/authenticate?username=${username}&password=${password}`;
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json'
      })
    };
    return this.http.post<LoginToken>(url, options)
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
      console.error(`Backend returned code ${error.status}, ` + `body was: ${JSON.stringify(error.error)}`);
    }
    // return an observable with a user-facing error message
    return throwError(error.error.message);
  }
}
