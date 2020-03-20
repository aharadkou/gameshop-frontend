import { NgModule } from '@angular/core';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { SharedModule } from '../shared/shared.module';
import { OrderDeleteDialogComponent } from './order-delete-dialog/order-delete-dialog.component';



@NgModule({
  declarations: [OrdersListComponent, OrderDeleteDialogComponent],
  imports: [
    SharedModule
  ],
  exports: [OrdersListComponent]
})
export class OrdersModule { }
