import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Order } from '../interfaces/order.model';
import { ORDERS_URL } from '../constants/constants';
import { Cart } from '../interfaces/cart.model';
import { OrderRequestParams } from '../interfaces/order-request-params.model';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DataChunk } from '../models/data-chunk';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  createOrder(order: Order, cart: Cart) {
    return this.http.post<Order>(ORDERS_URL, { order, cart });
  }

  updateOrder(order: Order) {
    const payload = { ...order };
    delete payload.cartItems;
    return this.http.put<Order>(`${ORDERS_URL}/${order.id}`, payload);
  }

  getOrders(paginationParams: OrderRequestParams, ordersChunk: DataChunk<Order>): Observable<DataChunk<Order>> {
    let params = new HttpParams();
    params = params.append('page', ordersChunk.page.toString());
    params = params.append('filter', paginationParams.filter.toString());
    params = params.append('limit', paginationParams.limit.toString());
    if (paginationParams.processedStatus !== 'All') {
      params = params.append('processedStatus', paginationParams.processedStatus.toString());
    }
    return this.http.get<any>(ORDERS_URL, {params}).pipe(
      switchMap(result => of(ordersChunk.populate(result)))
    );
  }

  deleteOrderById(orderId: number) {
    return this.http.delete<any>(`${ORDERS_URL}/${orderId}`);
  }
}
