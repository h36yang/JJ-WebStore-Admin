import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { LoginToken } from '../login/login-token';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

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

  authenticate(username: string, password: string): Observable<LoginToken> {
    const url = `${this.baseApi}Users/authenticate?username=${username}&password=${password}`;
    return this.http.post<LoginToken>(url, this.sharedHttpOptions)
      .pipe(
        catchError(this.shared.handleHttpError)
      );
  }
}
