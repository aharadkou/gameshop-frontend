import { Component, OnInit, ViewChild } from '@angular/core';
import { DataChunk } from 'src/app/common-services/models/data-chunk';
import { Order } from 'src/app/common-services/interfaces/order.model';
import { FilterOption } from 'src/app/common-services/interfaces/filter-option.model';
import { DATA_LOAD_LIMIT } from 'src/app/common-services/constants/constants';
import { OrderService } from 'src/app/common-services/services/order.service';
import { ListComponent } from 'src/app/shared/list/list.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Product } from 'src/app/common-services/interfaces/product.model';

@Component({
  selector: 'gs-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {

  ordersChunk: DataChunk<Order>;
  currentProcessedStatus: boolean | string = 'All';
  @ViewChild('list') list: ListComponent;
  statuses: FilterOption[] = [
    {
      displayValue: 'All',
      value: 'All'
    },
    {
      displayValue: 'Processed',
      value: true
    },
    {
      displayValue: 'Unprocessed',
      value: false
    }
  ];
  currentSearch = '';

  constructor(
    private orderService: OrderService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadOrders(true);
  }

  filterChanged(filterValue: boolean) {
    this.currentProcessedStatus = filterValue;
    this.loadOrders(true);
  }

  loadMoreOrders() {
    if (!this.ordersChunk.isAllDataLoaded) {
      this.loadOrders();
    }
  }

  processedStatusChanged(order: Order) {
    order.isProcessed = !order.isProcessed;
    this.orderService.updateOrder(order).subscribe(() => {
      this.ordersChunk = new DataChunk(this.ordersChunk);
    });
  }

  searchChanged(searchValue: string) {
    this.currentSearch = searchValue;
    this.loadOrders(true);
  }

  getTotalPrice(order: Order) {
    let total = 0;
    order.cartItems.forEach(cartItem => {
      if (cartItem.game) {
        total += cartItem.game.price * cartItem.count;
      }
    });
    return total;
  }

  openDeleteDialog(order: Order) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        message: `Are you sure want to delete Order № ${order.id}?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderService.deleteOrderById(order.id).subscribe(() => {
          this.loadOrders(true);
        });
      }
    });
  }

  private loadOrders(forceNewChunk = false) {
    const currentChunk = forceNewChunk ? new DataChunk<Order>() : this.ordersChunk;
    this.ordersChunk = new DataChunk({
      ...currentChunk,
      isLoaded: false
    } as DataChunk<Order>);
    this.orderService.getOrders({
      limit: DATA_LOAD_LIMIT,
      processedStatus: this.currentProcessedStatus,
      filter: this.currentSearch
    }, this.ordersChunk).subscribe(ordersChunk => {
      this.ordersChunk = ordersChunk;
      if (forceNewChunk && this.list) {
        this.list.scrollToTop();
      }
    });
  }

}
