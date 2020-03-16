import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataChunk } from '../models/chunk-model';
import { map, tap } from 'rxjs/operators';
import { SortOrder } from '../enums/sort-order.enum';
import { GameRequestParams } from '../interfaces/game-request-params.model';
import { GAMES_URL } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(paginationParams: GameRequestParams, productsChunk: DataChunk<Product>): Observable<DataChunk<Product>> {
    productsChunk.page += 1;
    productsChunk.isLoaded = false;
    let params = new HttpParams();
    params = params.append('page', productsChunk.page.toString());
    params = params.append('limit', paginationParams.limit.toString());
    params = params.append('filter', paginationParams.filter);
    params = params.append('categories[]', paginationParams.categories ? paginationParams.categories.toString() : undefined);
    paginationParams.sort.forEach(criteria => {
      if (criteria.order !== SortOrder.NONE) {
        params = params.append('sort[]', criteria.fieldName + ',' + criteria.order);
      }
    });
    return this.http.get<any>(GAMES_URL, {params}).pipe(
      map(result => productsChunk.populate(result)),
      tap(() => productsChunk.isLoaded = true)
    );
  }

  getProductsByIds(ids: number[]): Observable<Product[]> {
    let params = new HttpParams();
    ids.forEach(productId => {
      params = params.append('ids[]', productId.toString());
    });
    return this.http.get<Product[]>(GAMES_URL, {params});
  }
}
