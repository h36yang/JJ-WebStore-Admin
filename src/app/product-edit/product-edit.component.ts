import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from '../../environments/environment';
import { Product } from '../products/product';
import { Image } from '../image-upload/image';
import { ProductService } from '../services/product.service';
import { ImageUploadComponent } from '../image-upload/image-upload.component';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  baseApi: string;

  loading = false;
  updating = false;

  productId: number;
  productCategory: string;
  productAvatarId: number;
  productImages: Image[] = [];

  editProductForm: FormGroup;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) {
    // Set Base API URL
    this.baseApi = environment.baseApi;

    // Initialize Forms
    this.editProductForm = this.formBuilder.group({
      nameControl: ['', Validators.required],
      longNameControl: ['', Validators.required],
      typeControl: ['', Validators.required],
      descControl: ['', Validators.required],
      priceControl: ['', Validators.required],
      volumeControl: ['', Validators.required],
      productNumControl: [''],
      ingredientControl: [''],
      originControl: [''],
      producerControl: [''],
      highlightControl: ['']
    });
  }

  ngOnInit() {
    this.productId = +this.route.snapshot.paramMap.get('id');
    if (Number.isInteger(this.productId)) {
      this.loading = true;
      this.productService.getProduct(this.productId)
        .subscribe(
          (data: Product) => {
            this.editProductForm.get('nameControl').setValue(data.name);
            this.editProductForm.get('longNameControl').setValue(data.longName);
            this.editProductForm.get('typeControl').setValue(data.type);
            this.editProductForm.get('descControl').setValue(data.description);
            this.editProductForm.get('priceControl').setValue(data.price);
            this.editProductForm.get('volumeControl').setValue(data.volume);
            this.editProductForm.get('productNumControl').setValue(data.productNumber);
            this.editProductForm.get('ingredientControl').setValue(data.ingredient);
            this.editProductForm.get('originControl').setValue(data.origin);
            this.editProductForm.get('producerControl').setValue(data.producer);
            this.editProductForm.get('highlightControl').setValue(data.highlight);
            this.productCategory = `${data.categoryId}`;
            this.productAvatarId = data.avatarId;
            this.productImages = this.productImages.concat(data.productImages);
            this.loading = false;
          },
          error => this.onLoadError(error)
        );
    } else {
      this.onLoadError('Invalid Product ID passed');
    }
  }

  openUploadPicturesDialog() {
    const dialogRef = this.dialog.open(ImageUploadComponent, {
      width: '50%',
      height: '50%',
      data: true
    });

    dialogRef.afterClosed().subscribe((result: Image[]) => {
      this.productImages = this.productImages.concat(result);
    });
  }

  save() {
    this.updating = true;
    const product: Product = {
      id: this.productId,
      categoryId: +this.productCategory,
      name: this.editProductForm.get('nameControl').value,
      longName: this.editProductForm.get('longNameControl').value,
      type: this.editProductForm.get('typeControl').value,
      description: this.editProductForm.get('descControl').value,
      price: this.editProductForm.get('priceControl').value,
      volume: this.editProductForm.get('volumeControl').value,
      productNumber: this.editProductForm.get('productNumControl').value,
      ingredient: this.editProductForm.get('ingredientControl').value,
      origin: this.editProductForm.get('originControl').value,
      producer: this.editProductForm.get('producerControl').value,
      highlight: this.editProductForm.get('highlightControl').value,
      functions: [],
      productImages: this.productImages.map(x => {
        x.file = null; // remove file content before updating product
        return x;
      }),
      isActive: true
    };
    console.log(product);
    this.updating = false;
  }

  private onLoadError(error: string) {
    this.productId = null;
    this.loading = false;
    setTimeout(() => this.showErrorMessage(error));
  }

  private showErrorMessage(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 6000,
      verticalPosition: 'top'
    });
  }
}
