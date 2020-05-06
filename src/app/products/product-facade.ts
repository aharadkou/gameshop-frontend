import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from '../common-services/interfaces/product.model';
import { GameRequestParams } from '../common-services/interfaces/game-request-params.model';
import { ProductService } from '../common-services/services/product.service';
import { tap, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { SortCriteria } from '../common-services/interfaces/sort-criteria.model';
import { CategoryService } from '../common-services/services/category.service';
import { DataChunk } from '../common-services/models/data-chunk';
import { SortOrder } from '../common-services/models/sort-order.enum';

@Injectable({
  providedIn: 'root'
})
export class ProductFacade {

  private get DEFAULT_SORT_CRITERIAS() {
    return [
      {
        fieldText: 'Title',
        fieldName: 'title',
        order: SortOrder.NONE
      },
      {
        fieldText: 'Price',
        fieldName: 'price',
        order: SortOrder.NONE
      }
    ];
}
  private readonly DEFAULT_FILTER =  {value: -1, displayValue: 'All'};

  private productsChunk: BehaviorSubject<DataChunk<Product>>;

  private scrollTop: BehaviorSubject<number>;

  private sortCriterias: BehaviorSubject<SortCriteria[]>;

  private filter: BehaviorSubject<number>;

  private search: BehaviorSubject<string>;

  constructor(
    private productService: ProductService,
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.productsChunk = new BehaviorSubject(undefined);
    this.scrollTop = new BehaviorSubject(0);
    this.sortCriterias = new BehaviorSubject(this.DEFAULT_SORT_CRITERIAS);
    this.filter = new BehaviorSubject(this.DEFAULT_FILTER.value);
    this.search = new BehaviorSubject('');
  }

  loadProducts(paginationParams: GameRequestParams, forceNewChunk = false) {
    const currentChunk = forceNewChunk ? new DataChunk() : this.getProductsChunk();
    this.productsChunk.next(
      new DataChunk({
        ...currentChunk,
        isLoaded: false
      } as DataChunk<Product>)
    );
    return this.productService.getProducts(paginationParams, this.getProductsChunk()).pipe(
      tap(productsChunk => this.productsChunk.next(productsChunk))
    );
  }

  addProduct(productData: FormData) {
    this.setDefault();
    return this.productService.addProduct(productData).pipe(
      tap(() => this.router.navigateByUrl(''))
    );
  }

  updateProduct(productData: FormData) {
    this.setDefault();
    return this.productService.updateProduct(productData).pipe(
      tap(() => this.router.navigateByUrl(''))
    );
  }

  private setDefault() {
    this.setScrollTop(0);
    this.setProductsChunk(undefined);
    this.setSortCriterias(this.DEFAULT_SORT_CRITERIAS);
    this.setFilter(this.DEFAULT_FILTER.value);
    this.setSearch('');
  }

  getProductFromRoute(activatedRoute: ActivatedRoute) {
    return activatedRoute.paramMap.pipe(
      switchMap(map => {
        const productId = +map.get('id');
        return this.productService.getProductsByIds([productId]).pipe(
          switchMap(products => of(products ? products[0] : null))
        );
      })
    );
  }

  deleteProductById(productId: number) {
    this.setDefault();
    return this.productService.deleteProductById(productId);
  }

  getCategories$() {
    return this.categoryService.getCategories().pipe(
      switchMap(
        categories => of(
          [this.DEFAULT_FILTER].concat(
            categories.map(category =>
              ({
                value: category.id,
                displayValue: category.name
              })
            )
          )
        )
      )
    );
  }

  setProductsChunk(productsChunk: DataChunk<Product>) {
    return this.productsChunk.next(productsChunk);
  }

  getProductsChunk() {
    return this.productsChunk.getValue();
  }

  getProductsChunk$(): Observable<DataChunk<Product>> {
    return this.productsChunk;
  }

  getScrollTop() {
    return this.scrollTop.getValue();
  }

  setScrollTop(scrollTop: number) {
    return this.scrollTop.next(scrollTop);
  }

  getSortCriterias$(): Observable<SortCriteria[]> {
    return this.sortCriterias;
  }

  getSortCriterias() {
    return this.sortCriterias.getValue();
  }

  setSortCriterias(sortCriterias: SortCriteria[]) {
    return this.sortCriterias.next(sortCriterias);
  }

  getFilter$(): Observable<number> {
    return this.filter;
  }

  getFilter() {
    return this.filter.getValue();
  }

  setFilter(filter: number) {
    return this.filter.next(filter);
  }

  getSearch$(): Observable<string> {
    return this.search;
  }

  getSearch() {
    return this.search.getValue();
  }

  setSearch(search: string) {
    return this.search.next(search);
  }

}
