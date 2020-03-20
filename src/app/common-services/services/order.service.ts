import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Order } from '../interfaces/order.model';
import { ORDERS_URL } from '../constants/constants';
import { Cart } from '../interfaces/cart.model';
import { OrderRequestParams } from '../interfaces/order-request-params.model';
import { DataChunk } from '../models/chunk-model';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  createOrder(order: Order, cart: Cart) {
    const body = {
      order,
      cart
    };
    return this.http.post<Order>(ORDERS_URL, body);
  }

  updateOrder(order: Order) {
    return this.http.put<Order>(`${ORDERS_URL}/${order.id}`, order);
  }

  getOrders(paginationParams: OrderRequestParams, ordersChunk: DataChunk<Order>): Observable<DataChunk<Order>> {
    ordersChunk.page += 1;
    ordersChunk.isLoaded = false;
    let params = new HttpParams();
    params = params.append('page', ordersChunk.page.toString());
    params = params.append('filter', paginationParams.filter.toString());
    params = params.append('limit', paginationParams.limit.toString());
    if (paginationParams.processedStatus !== 'All') {
      params = params.append('processedStatus', paginationParams.processedStatus.toString());
    }
    return this.http.get<any>(ORDERS_URL, {params}).pipe(
      map(result => ordersChunk.populate(result)),
      tap(() => ordersChunk.isLoaded = true)
    );
  }

  deleteOrderById(orderId: number) {
    return this.http.delete<any>(`${ORDERS_URL}/${orderId}`);
  }
}
