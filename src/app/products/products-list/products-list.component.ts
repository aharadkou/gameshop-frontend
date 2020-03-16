import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { Product } from 'src/app/common-services/interfaces/product.model';
import { ProductService } from 'src/app/common-services/services/product.service';
import { CartService } from 'src/app/common-services/services/cart.service';
import { SortOrder } from 'src/app/common-services/enums/sort-order.enum';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataChunk } from 'src/app/common-services/models/chunk-model';
import { DATA_LOAD_LIMIT, SNACKBAR_DURATION, LOADING_DEBOUNCE } from 'src/app/common-services/constants/constants';
import { SortCriteria } from 'src/app/common-services/interfaces/sort-criteria.model';
import { FilterOption } from 'src/app/common-services/interfaces/filter-option.model';
import { CategoryService } from 'src/app/common-services/services/category.service';
import { ListComponent } from 'src/app/shared/list/list.component';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'gs-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, OnDestroy {

  productsChunk: DataChunk<Product>;
  categories: FilterOption[];
  sortOrder = SortOrder;
  $isLoading = new BehaviorSubject(false);
  isLoading = false;
  @ViewChild('list') list: ListComponent;
  snackBarRef: MatSnackBarRef<SimpleSnackBar>;
  sortCriterias = [
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
  currentFilter: FilterOption = {value: -1, displayValue: 'All'};
  currentSearch = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadProducts(true);
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = [this.currentFilter].concat(categories.map(category => {
        return {
          value: category.id,
          displayValue: category.name
        };
      }));
    });
    this.$isLoading.pipe(debounceTime(LOADING_DEBOUNCE)).subscribe(flag => {
      this.isLoading = flag;
    });
  }

  ngOnDestroy(): void {
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.snackBarRef = this.snackBar.open(`${product.title} was added to your cart!`, 'Proceed to checkout', {
      duration: SNACKBAR_DURATION
    });
    this.snackBarRef.onAction().subscribe(() => {
      this.router.navigateByUrl('/cart');
    });
  }

  sortChanged(sortCriterias: SortCriteria[]) {
    this.sortCriterias = sortCriterias;
    this.loadProducts(true);
  }

  searchChanged(searchValue: string) {
    this.currentSearch = searchValue;
    this.loadProducts(true);
  }

  filterChanged(filterOption: FilterOption) {
    this.currentFilter = filterOption;
    this.loadProducts(true);
  }

  loadMoreProducts() {
    if (!this.productsChunk.isAllDataLoaded) {
      this.loadProducts();
    }
  }

  private loadProducts(forceNewChunk = false) {
    this.$isLoading.next(true);
    this.productsChunk = forceNewChunk ? new DataChunk<Product>() : this.productsChunk;
    this.cdRef.detectChanges();
    this.productService.getProducts({
      limit: DATA_LOAD_LIMIT,
      sort: this.sortCriterias,
      filter: this.currentSearch,
      categories: [this.currentFilter.value]
    }, this.productsChunk).subscribe(() => {
      this.$isLoading.next(false);
      this.cdRef.detectChanges();
      if (forceNewChunk && this.list) {
        this.list.scrollToTop();
      }
    });
  }

}
