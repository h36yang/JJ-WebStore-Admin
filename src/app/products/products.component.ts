import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from '../../environments/environment';
import { ProductService } from '../services/product.service';
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

  constructor(private productService: ProductService, private snackBar: MatSnackBar) {
    this.baseApi = environment.baseApi;
  }

  ngOnInit() {
    this.productService.getAllProducts()
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
      this.productService.deleteProduct(id)
        .subscribe(
          () => this.ngOnInit(),
          error => this.handleError(error)
        );
    } else {
      this.productService.recoverProduct(id)
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
