import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ConfirmOrderDialogComponent } from './confirm-order-dialog/confirm-order-dialog.component';
import { CartComponent } from './cart/cart.component';
import { CartProductsComponent } from './cart-products/cart-products.component';

@NgModule({
  declarations: [ConfirmOrderDialogComponent, CartComponent, CartProductsComponent],
  imports: [
    SharedModule
  ],
  exports: [CartComponent]
})
export class CartModule { }
