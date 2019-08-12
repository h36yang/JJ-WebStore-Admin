import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppSettings } from '../app.settings';
import { ApiService } from '../api.service';
import { Product } from './product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  loading = true;
  products: Product[];
  baseApi: string;

  constructor(private api: ApiService, private snackBar: MatSnackBar) {
    this.baseApi = AppSettings.API_BASE_URL;
  }

  ngOnInit() {
    this.api.getAllProducts()
      .subscribe(
        (data: Product[]) => {
          this.products = data;
          this.loading = false;
        },
        error => this.handleError(error)
      );
  }

  flipProduct(id: number, toDelete: boolean) {
    this.loading = true;
    if (toDelete) {
      this.api.deleteProduct(id)
        .subscribe(
          () => this.ngOnInit(),
          error => this.handleError(error)
        );
    } else {
      this.api.recoverProduct(id)
        .subscribe(
          () => this.ngOnInit(),
          error => this.handleError(error)
        );
    }
  }

  private handleError(error: any) {
    this.loading = false;
    this.snackBar.open(error, 'Dismiss', {
      duration: 6000,
      verticalPosition: 'top'
    });
  }
}
