import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public handleHttpError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, body was: \n${JSON.stringify(error, null, 2)}`);
    }
    // return an observable with a user-facing error message
    if (error.error && error.error.message) {
      return throwError(error.error.message);
    } else if (error.message) {
      return throwError(error.message);
    } else {
      return throwError('Something bad happened; please try again later.');
    }
  }

  public mergeArrays(...arrays: any[]) {
    let jointArray = [];
    arrays.forEach(array => {
      jointArray = jointArray.concat(array);
    });
    const uniqueSet = new Set([...jointArray]);
    return Array.from(uniqueSet);
  }
}
