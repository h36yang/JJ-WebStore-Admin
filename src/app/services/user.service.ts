import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AppSettings } from '../app.settings';
import { User } from '../users/user';
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

  isAuthenticated(): boolean {
    const token: string = localStorage.getItem(AppSettings.API_TOKEN_KEY);
    return (token !== null && token.length > 0);
  }

  logoff() {
    localStorage.removeItem(AppSettings.API_TOKEN_KEY);
  }

  authenticate(username: string, password: string): Observable<User> {
    const url = `${this.baseApi}Users/authenticate?username=${username}&password=${password}`;
    return this.http.post<User>(url, this.sharedHttpOptions)
      .pipe(
        catchError(this.shared.handleHttpError)
      );
  }

  getCurrentUser(): Observable<User> {
    const url = `${this.baseApi}Users/whoami`;
    return this.http.get<User>(url, this.sharedHttpOptions)
      .pipe(
        catchError(this.shared.handleHttpError)
      );
  }
}
