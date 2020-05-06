import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Product } from 'src/app/common-services/interfaces/product.model';
import { CartService } from 'src/app/common-services/services/cart.service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DATA_LOAD_LIMIT, SNACKBAR_DURATION, LOADING_DEBOUNCE } from 'src/app/common-services/constants/constants';
import { SortCriteria } from 'src/app/common-services/interfaces/sort-criteria.model';
import { ListComponent } from 'src/app/shared/list/list.component';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ProductFacade } from '../product-facade';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { SortOrder } from 'src/app/common-services/models/sort-order.enum';
import { AuthService } from 'src/app/common-services/services/auth.service';
import { Role } from 'src/app/common-services/models/role.enum';

@Component({
  selector: 'gs-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, OnDestroy, AfterViewInit {
  sortOrder = SortOrder;
  private isLoading = new BehaviorSubject(false);

  get isLoading$() {
    return this.isLoading.pipe(debounceTime(LOADING_DEBOUNCE));
  }

  @ViewChild('list') list: ListComponent;
  snackBarRef: MatSnackBarRef<SimpleSnackBar>;
  productsChunk = this.productFacade.getProductsChunk$();
  categories = this.productFacade.getCategories$();
  sortCriterias = this.productFacade.getSortCriterias$();
  filter = this.productFacade.getFilter$();
  search = this.productFacade.getSearch$();
  isAuthenticated = this.authService.isAuthenticated$;

  constructor(
    private productFacade: ProductFacade,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit() {
    if (!this.productFacade.getProductsChunk()) {
      this.loadProducts(true);
    }
  }

  ngAfterViewInit() {
    if (this.productFacade.getProductsChunk() && this.productFacade.getScrollTop() && this.list) {
      this.list.scrollTop = this.productFacade.getScrollTop();
    }
  }

  ngOnDestroy() {
    if (this.list) {
      this.productFacade.setScrollTop(this.list.scrollTop );
    }
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product.id);
    this.snackBarRef = this.snackBar.open(`${product.title} was added to your cart!`, 'Proceed to checkout', {
      duration: SNACKBAR_DURATION
    });
    this.snackBarRef.onAction().subscribe(() => {
      this.router.navigateByUrl('/cart');
    });
  }

  sortChanged(sortCriterias: SortCriteria[]) {
    this.productFacade.setSortCriterias(sortCriterias);
    this.loadProducts(true);
  }

  searchChanged(searchValue: string) {
    this.productFacade.setSearch(searchValue);
    this.loadProducts(true);
  }

  filterChanged(filter: number) {
    this.productFacade.setFilter(filter);
    this.loadProducts(true);
  }

  loadMoreProducts() {
    this.loadProducts();
  }

  hasRole(role: string) {
    return this.authService.hasRole(role);
  }

  openDetails(product: Product) {
    this.router.navigate(['/products', product.id]);
  }

  openDeleteDialog(product: Product) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `Are you sure want to delete ${product.title}?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productFacade.deleteProductById(product.id).subscribe(() => {
          this.loadProducts(true);
        });
      }
    });
  }

  private loadProducts(forceNewChunk = false) {
    this.isLoading.next(true);
    this.productFacade.loadProducts({
      limit: DATA_LOAD_LIMIT,
      sort: this.productFacade.getSortCriterias(),
      filter: this.productFacade.getSearch(),
      categories: [this.productFacade.getFilter()]
    }, forceNewChunk).subscribe(() => {
      this.isLoading.next(false);
      if (forceNewChunk && this.list) {
        this.list.scrollToTop();
      }
    });
  }

}
