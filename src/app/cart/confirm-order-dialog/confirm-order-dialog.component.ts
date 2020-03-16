import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from 'src/app/common-services/interfaces/order.model';

@Component({
  selector: 'gs-confirm-order-dialog',
  templateUrl: './confirm-order-dialog.component.html',
  styleUrls: ['./confirm-order-dialog.component.scss']
})
export class ConfirmOrderDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmOrderDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Partial<Order>) { }

  ngOnInit(): void {
  }

}
