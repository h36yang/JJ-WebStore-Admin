import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpEvent } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Image } from '../image-upload/image';

export interface UploadObservable {
  [name: string]: Observable<HttpEvent<Image>>;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  baseApi: string;

  constructor(private http: HttpClient) {
    this.baseApi = environment.baseApi;
  }

  uploadImages(images: Image[]): UploadObservable {
    // this will be the our resulting map
    const results: UploadObservable = {};

    images.forEach(image => {
      const url = `${this.baseApi}Images?name=${image.name}`;

      // create a new multipart-form for every file
      const formData = new FormData();
      formData.append('file', image.file, image.file.name);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const options = {
        reportProgress: true,
        headers: new HttpHeaders({
          Accept: 'application/json'
        })
      };
      const req = new HttpRequest<FormData>('POST', url, formData, options);
      // Save every observable in a map of all observables
      results[image.name] = this.http.request<Image>(req);
    });

    // return the map of observables
    return results;
  }
}
