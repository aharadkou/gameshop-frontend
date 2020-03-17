import { NgModule } from '@angular/core';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [OrdersListComponent],
  imports: [
    SharedModule
  ],
  exports: [OrdersListComponent]
})
export class OrdersModule { }
