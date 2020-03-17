import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DataChunk } from 'src/app/common-services/models/chunk-model';
import { Order } from 'src/app/common-services/interfaces/order.model';
import { FilterOption } from 'src/app/common-services/interfaces/filter-option.model';
import { DATA_LOAD_LIMIT } from 'src/app/common-services/constants/constants';
import { OrderService } from 'src/app/common-services/services/order.service';
import { ListComponent } from 'src/app/shared/list/list.component';

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
    private cdRef: ChangeDetectorRef,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loadOrders(true);
  }

  filterChanged(filterOption: FilterOption) {
    this.currentProcessedStatus = filterOption.value;
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
      this.cdRef.detectChanges();
    });
  }

  searchChanged(searchValue: string) {
    this.currentSearch = searchValue;
    this.loadOrders(true);
  }

  private loadOrders(forceNewChunk = false) {
    this.ordersChunk = forceNewChunk ? new DataChunk<Order>() : this.ordersChunk;
    this.cdRef.detectChanges();
    this.orderService.getOrders({
      limit: DATA_LOAD_LIMIT,
      processedStatus: this.currentProcessedStatus,
      filter: this.currentSearch
    }, this.ordersChunk).subscribe(() => {
      this.cdRef.detectChanges();
      if (forceNewChunk && this.list) {
        this.list.scrollToTop();
      }
    });
  }

}
