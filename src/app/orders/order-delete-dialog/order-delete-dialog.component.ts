import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmOrderDialogComponent } from 'src/app/cart/confirm-order-dialog/confirm-order-dialog.component';
import { Order } from 'src/app/common-services/interfaces/order.model';
import { OrderService } from 'src/app/common-services/services/order.service';

@Component({
  selector: 'gs-order-delete-dialog',
  templateUrl: './order-delete-dialog.component.html',
  styleUrls: ['./order-delete-dialog.component.scss']
})
export class OrderDeleteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  deleteOrder() {
  }

}
