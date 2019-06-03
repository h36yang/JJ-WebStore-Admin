import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { forkJoin, Observable, Subject } from 'rxjs';

import { TrimFileExtPipe } from '../trim-file-ext.pipe';
import { Image } from '../image-upload/image';
import { ImageService, UploadObservable } from '../image.service';
import { SSL_OP_SINGLE_DH_USE } from 'constants';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {

  @ViewChild('pictures') pictures: ElementRef;
  uploadPicturesForm: FormGroup;

  imageFiles: { [key: string]: File };
  imageUrls: { [key: string]: string | ArrayBuffer };
  imageResults: Image[];
  uploadResults: UploadObservable;
  uploadProgress: { [name: string]: Observable<number> };

  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: boolean,
    private dialogRef: MatDialogRef<ImageUploadComponent>,
    private imageService: ImageService,
    private trimFileExtPipe: TrimFileExtPipe,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.uploadPicturesForm = this.formBuilder.group({
      pictures: this.formBuilder.array([])
    });
    this.imageResults = [];
  }

  get picturesControlGroups(): FormArray {
    return this.uploadPicturesForm.get('pictures') as FormArray;
  }

  addPictures() {
    this.pictures.nativeElement.click();
  }

  onFilesAdded() {
    this.imageFiles = this.pictures.nativeElement.files;
    this.imageUrls = {};
    this.picturesControlGroups.setValue([]);

    for (const key in this.imageFiles) {
      if (!isNaN(parseInt(key, 10))) {
        const file: File = this.imageFiles[key];
        // Push new image file to form control groups array
        this.picturesControlGroups.push(
          this.formBuilder.group({
            nameControl: [this.trimFileExtPipe.transform(file.name), Validators.required],
            fileControl: [file]
          })
        );

        // Get image source URL for preview
        this.setPreviewImageUrl(key, file);
      }
    }
  }

  setPreviewImageUrl(key: string, image: File) {
    if (image.size === 0 || image.type.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrls[key] = reader.result;
    }
    reader.readAsDataURL(image);
  }

  closeDialog() {
    // if everything was uploaded already, just close the dialog
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }

    // set the component state to "uploading"
    this.uploading = true;

    // start the upload and save the progress map
    const imageFiles: Image[] = [];
    for (let i = 0; i < this.picturesControlGroups.length; i++) {
      const ctrlGroup = this.picturesControlGroups.at(i);
      imageFiles.push({
        name: ctrlGroup.get('nameControl').value,
        file: ctrlGroup.get('fileControl').value
      });
      // disable name control while uploading to avoid changing
      ctrlGroup.get('nameControl').disable();
    }
    this.uploadResults = this.imageService.uploadImages(imageFiles);
    this.uploadProgress = {};
    const allProgressObservables: Observable<number>[] = [];

    for (const key in this.uploadResults) {
      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // subscribe to each observable for progress-updates
      this.uploadResults[key].subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          // calculate the progress percentage and pass into the progress-stream
          progress.next(Math.round(100 * event.loaded / event.total));
        } else if (event instanceof HttpResponse) {
          // Close the progress-stream if the upload is complete
          progress.complete();
          this.imageResults.push(event.body);
        }
      });

      // convert progress to observables
      this.uploadProgress[key] = progress.asObservable();
      allProgressObservables.push(progress.asObservable());
    }

    // Adjust the state variables

    // The OK-button should have the text "Finish" now
    this.primaryButtonText = 'Finish';

    // The dialog should not be closed while uploading
    this.canBeClosed = false;
    this.dialogRef.disableClose = true;

    // Hide the cancel-button
    this.showCancelButton = false;

    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe(() => {
      // ... the dialog can be closed again...
      this.canBeClosed = true;
      this.dialogRef.disableClose = false;

      // ... the upload was successful...
      this.uploadSuccessful = true;

      // ... and the component is no longer uploading
      this.uploading = false;

      console.log(this.imageResults);
    });
  }
}
