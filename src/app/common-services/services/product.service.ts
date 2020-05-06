import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../interfaces/product.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { GameRequestParams } from '../interfaces/game-request-params.model';
import { GAMES_URL } from '../constants/constants';
import { DataChunk } from '../models/data-chunk';
import { SortOrder } from '../models/sort-order.enum';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(paginationParams: GameRequestParams, productsChunk: DataChunk<Product>): Observable<DataChunk<Product>> {
    let params = new HttpParams();
    params = params.append('page', productsChunk.page.toString());
    params = params.append('limit', paginationParams.limit.toString());
    params = params.append('filter', paginationParams.filter.toString());
    params = params.append('categories[]', paginationParams.categories ? paginationParams.categories.toString() : undefined);
    paginationParams.sort.forEach(criteria => {
      if (criteria.order !== SortOrder.NONE) {
        params = params.append('sort[]', criteria.fieldName + ',' + criteria.order);
      }
    });
    return this.http.get<any>(GAMES_URL, {params}).pipe(
      switchMap(result => of(productsChunk.populate(result)))
    );
  }

  getProductsByIds(ids: number[]): Observable<Product[]> {
    let params = new HttpParams();
    ids.forEach(productId => {
      params = params.append('ids[]', productId.toString());
    });
    return this.http.get<Product[]>(GAMES_URL, {params});
  }

  addProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(GAMES_URL, productData);
  }

  updateProduct(productData: FormData): Observable<Product> {
    return this.http.put<Product>(`${GAMES_URL}/${productData.get('id')}`, productData);
  }

  deleteProductById(productId: number): Observable<Product> {
    return this.http.delete<Product>(`${GAMES_URL}/${productId}`);
  }

}
