import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/common-services/services/cart.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from 'src/app/common-services/services/order.service';
import {
  SNACKBAR_DURATION,
  PATTERN_TELEPHONE
} from 'src/app/common-services/constants/constants';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmOrderDialogComponent } from '../confirm-order-dialog/confirm-order-dialog.component';

@Component({
  selector: 'gs-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private orderService: OrderService,
    public dialog: MatDialog
  ) { }

  nameFormGroup: FormGroup;
  emailFormGroup: FormGroup;
  telephoneFormGroup: FormGroup;
  doneFormGroup: FormGroup;
  $addedProductCount = this.cartService.$addedProductCount;

  ngOnInit() {

    this.nameFormGroup = this.formBuilder.group({
      name: ['', Validators.required]
    });
    this.emailFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.telephoneFormGroup = this.formBuilder.group({
      telephone: ['', [Validators.required, Validators.pattern(PATTERN_TELEPHONE)]]
    });
    this.doneFormGroup = this.formBuilder.group({
      comment: ['']
    });
  }

  get name() {
    return this.nameFormGroup.get('name');
  }

  get email() {
    return this.emailFormGroup.get('email');
  }

  get telephone() {
    return this.telephoneFormGroup.get('telephone');
  }


  confirmOrder() {
    const dialogRef = this.dialog.open(ConfirmOrderDialogComponent, {
      width: '400px',
      data: {
        email: this.email.value,
        name: this.name.value,
        phone: this.telephone.value
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const comment = this.doneFormGroup.get('comment').value;
        this.orderService.createOrder({
          comment,
          email: this.email.value,
          name: this.name.value,
          phone: this.telephone.value
        }, this.cartService.getCart()).subscribe(order => {
          this.cartService.clearCart();
          this.router.navigateByUrl('');
          this.snackBar.open(`Thank you for your order, ${order.name}! We'll process your Order № ${order.id} soon!`, 'Success', {
            duration: SNACKBAR_DURATION
          });
        });
      }
    });
  }

}
