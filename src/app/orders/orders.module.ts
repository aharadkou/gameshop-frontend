import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [OrdersListComponent],
  imports: [
    SharedModule
  ]
})
export class OrdersModule { }
