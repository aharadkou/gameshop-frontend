import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../interfaces/product.model';
import { KEY_CART_ITEMS } from '../constants/constants';
import { Cart } from '../interfaces/cart.model';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  $addedProductCount: BehaviorSubject<number>;

  constructor() {
    this.$addedProductCount = new BehaviorSubject(this.getProductCount(this.getCart()));
  }

  addToCart(product: Product) {
    const cart = this.getCart();
    if (!cart[product.id]) {
      cart[product.id] = 0;
    }
    cart[product.id] += 1;
    this.saveToLocalStorage(cart);
  }

  setCount(product: Product, count: number) {
    const cart = this.getCart();
    cart[product.id] = count;
    this.saveToLocalStorage(cart);
  }

  removeFromCart(product: Product) {
    const cart = this.getCart();
    delete cart[product.id];
    this.saveToLocalStorage(cart);
  }

  private saveToLocalStorage(cart: Cart) {
    this.$addedProductCount.next(
      this.getProductCount(cart)
    );
    localStorage.setItem(KEY_CART_ITEMS, JSON.stringify(cart));
  }

  private getProductCount(cart: Cart) {
    return Object.values(cart).reduce((total: number, value: number) => total + value, 0);
  }

  clearCart() {
    localStorage.removeItem(KEY_CART_ITEMS);
    this.$addedProductCount.next(0);
  }

  getCart() {
    const cartItems = JSON.parse(localStorage.getItem(KEY_CART_ITEMS));
    return cartItems || {};
  }

  getProductsIds() {
    return Object.keys(this.getCart()).map(value => +value);
  }
}
