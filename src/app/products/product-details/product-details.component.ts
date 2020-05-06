import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/common-services/interfaces/product.model';
import { CartService } from 'src/app/common-services/services/cart.service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { SNACKBAR_DURATION } from 'src/app/common-services/constants/constants';
import { ProductFacade } from '../product-facade';

@Component({
  selector: 'gs-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  constructor(
    private activatedRoute: ActivatedRoute,
    private productFacade: ProductFacade,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  product: Product;
  snackBarRef: MatSnackBarRef<SimpleSnackBar>;

  ngOnInit() {
    this.productFacade.getProductFromRoute(this.activatedRoute).subscribe(product => this.product = product);
  }

  addToCart() {
    this.cartService.addToCart(this.product.id);
    this.snackBarRef = this.snackBar.open(`${this.product.title} was added to your cart!`, 'Proceed to checkout', {
      duration: SNACKBAR_DURATION
    });
    this.snackBarRef.onAction().subscribe(() => {
      this.router.navigateByUrl('/cart');
    });
  }

  ngOnDestroy() {
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }

}
