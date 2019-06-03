import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatToolbarModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatStepperModule,
  MatDialogModule
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth.interceptor';
import { ApiService } from './api.service';
import { ImageService } from './image.service';
import { TrimFileExtPipe } from './trim-file-ext.pipe';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { ProductsComponent } from './products/products.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    ProductsComponent,
    ProductEditComponent,
    ImageUploadComponent,
    TrimFileExtPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatStepperModule,
    MatDialogModule
  ],
  entryComponents: [ImageUploadComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    ApiService,
    ImageService,
    TrimFileExtPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
