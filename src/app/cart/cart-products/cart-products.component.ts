import { Component, OnInit } from '@angular/core';
import { FormArray, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { Product } from 'src/app/common-services/interfaces/product.model';
import { ProductService } from 'src/app/common-services/services/product.service';
import { MIN_CART_COUNT, MAX_CART_COUNT, CHANGE_COUNT_DEBOUNCE } from 'src/app/common-services/constants/constants';
import { merge } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { CartService } from 'src/app/common-services/services/cart.service';

@Component({
  selector: 'gs-cart-products',
  templateUrl: './cart-products.component.html',
  styleUrls: ['./cart-products.component.scss']
})
export class CartProductsComponent implements OnInit {

  countInputs: FormArray;
  addedProducts: Product[];

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.productService.getProductsByIds(this.cartService.getProductsIds()).subscribe(
      products => {
        if (products) {
          this.addedProducts = products;
          this.countInputs = this.formBuilder.array([]);
          this.addedProducts.forEach(addedProduct => {
            this.countInputs.push(
              this.formBuilder.control(this.getProductCount(addedProduct), [
                Validators.required,
                Validators.min(MIN_CART_COUNT),
                Validators.max(MAX_CART_COUNT)
              ])
            );
          });
          this.mergeCountInputs();
        }
      }
    );
  }

  private mergeCountInputs() {
    merge(...this.countInputs.controls.map((control: AbstractControl, i: number) =>
      control.valueChanges.pipe(
          debounceTime(CHANGE_COUNT_DEBOUNCE),
          map(value => ({ i, control, data: value }))
      )
    )).subscribe(changes => {
      if (!changes.control.invalid) {
        this.setProductCount(this.addedProducts[changes.i], changes.control.value);
      }
    });
  }

  getProductCount(product: Product) {
    return +this.cartService.getCart()[product.id];
  }

  setProductCount(product: Product, count: number) {
    return this.cartService.setCount(product, count);
  }

  getTotalProductPrice(product: Product) {
    const cart = this.cartService.getCart();
    const addedProduct = this.findProductById(product.id);
    return +cart[product.id] * addedProduct.price;
  }

  getTotalPrice() {
    let total = 0;
    const cart = this.cartService.getCart();
    this.cartService.getProductsIds().forEach(productId => {
      if (this.addedProducts) {
        const addedProduct = this.findProductById(productId);
        if (addedProduct) {
          total += +cart[productId] * addedProduct.price;
        }
      }
    });
    return total;
  }

  getCountControl(i: number) {
    return this.countInputs.controls[i];
  }

  removeFromCart(product: Product) {
    this.cartService.removeFromCart(product);
  }

  private findProductById(productId: number) {
    return this.addedProducts.find(addedProduct => productId === addedProduct.id);
  }

}
