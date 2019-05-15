import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { ApiService } from '../api.service';
import { Product } from '../products/product';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  loading: boolean;
  updating: boolean;
  productId: number;
  productCategory: string;

  nameFormControl: FormControl;
  longNameFormControl: FormControl;
  typeFormControl: FormControl;
  descFormControl: FormControl;
  priceFormControl: FormControl;
  volumeFormControl: FormControl;
  productNumFormControl: FormControl;
  ingredientFormControl: FormControl;
  originFormControl: FormControl;
  producerFormControl: FormControl;
  highlightFormControl: FormControl;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.updating = false;

    this.nameFormControl = new FormControl('', [Validators.required]);
    this.longNameFormControl = new FormControl('', [Validators.required]);
    this.typeFormControl = new FormControl('', [Validators.required]);
    this.descFormControl = new FormControl('', [Validators.required]);
    this.priceFormControl = new FormControl('', [Validators.required]);
    this.volumeFormControl = new FormControl('', [Validators.required]);
    this.productNumFormControl = new FormControl();
    this.ingredientFormControl = new FormControl();
    this.originFormControl = new FormControl();
    this.producerFormControl = new FormControl();
    this.highlightFormControl = new FormControl();

    this.productId = +this.route.snapshot.paramMap.get('id');
    if (Number.isInteger(this.productId)) {
      this.loading = true;
      this.api.getProduct(this.productId)
        .subscribe(
          (data: Product) => {
            this.nameFormControl.setValue(data.name);
            this.longNameFormControl.setValue(data.longName);
            this.typeFormControl.setValue(data.type);
            this.descFormControl.setValue(data.description);
            this.priceFormControl.setValue(data.price);
            this.volumeFormControl.setValue(data.volume);
            this.productNumFormControl.setValue(data.productNumber);
            this.ingredientFormControl.setValue(data.ingredient);
            this.originFormControl.setValue(data.origin);
            this.producerFormControl.setValue(data.producer);
            this.highlightFormControl.setValue(data.highlight);
            this.productCategory = `${data.categoryId}`;
            this.loading = false;
          },
          error => this.onLoadError(error)
        );
    } else {
      this.onLoadError('Invalid Product ID passed');
    }
  }

  save() {
    this.updating = true;
    const product: Product = {
      id: this.productId,
      categoryId: +this.productCategory,
      name: this.nameFormControl.value,
      longName: this.longNameFormControl.value,
      type: this.typeFormControl.value,
      description: this.descFormControl.value,
      price: this.priceFormControl.value,
      volume: this.volumeFormControl.value,
      productNumber: this.productNumFormControl.value,
      ingredient: this.ingredientFormControl.value,
      origin: this.originFormControl.value,
      producer: this.producerFormControl.value,
      highlight: this.highlightFormControl.value,
      productFunction: [],
      isActive: true
    };
    console.log(product);
    this.updating = false;
  }

  private onLoadError(error: string) {
    this.productId = null;
    this.loading = false;
    this.disableFormControls();
    setTimeout(() => this.showErrorMessage(error));
  }

  private showErrorMessage(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 6000,
      verticalPosition: 'top'
    });
  }

  private disableFormControls() {
    this.nameFormControl.disable();
    this.longNameFormControl.disable();
    this.typeFormControl.disable();
    this.descFormControl.disable();
    this.priceFormControl.disable();
    this.volumeFormControl.disable();
    this.productNumFormControl.disable();
    this.ingredientFormControl.disable();
    this.originFormControl.disable();
    this.producerFormControl.disable();
    this.highlightFormControl.disable();
  }
}
