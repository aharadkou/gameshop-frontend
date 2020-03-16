import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/common-services/services/product.service';
import { Product } from 'src/app/common-services/interfaces/product.model';
import { CartService } from 'src/app/common-services/services/cart.service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { SNACKBAR_DURATION } from 'src/app/common-services/constants/constants';

@Component({
  selector: 'gs-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  product: Product;
  snackBarRef: MatSnackBarRef<SimpleSnackBar>;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(map => {
      const productId = +map.get('id');
      this.productService.getProductsByIds([productId]).subscribe(products => {
        if (products && products[0]) {
          this.product = products[0];
        }
      });
    });
  }

  addToCart() {
    this.cartService.addToCart(this.product);
    this.snackBarRef = this.snackBar.open(`${this.product.title} was added to your cart!`, 'Proceed to checkout', {
      duration: SNACKBAR_DURATION
    });
    this.snackBarRef.onAction().subscribe(() => {
      this.router.navigateByUrl('/cart');
    });
  }

  ngOnDestroy(): void {
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }

}
