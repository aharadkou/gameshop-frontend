import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './common-services/interceptors/interceptor.service';
import { CartComponent } from './cart/cart/cart.component';
import { ProductsListComponent } from './products/products-list/products-list.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { ErrorComponent } from './shared/error/error.component';
import { ProductAddComponent } from './products/product-add/product-add.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';
import { OrdersListComponent } from './orders/orders-list/orders-list.component';
import { AuthGuard } from './common-services/guards/auth.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    children: [
      {
        component: ProductsListComponent,
        path: ''
      },
      {
        component: ProductDetailsComponent,
        path: ':id'
      },
      {
        component: ProductAddComponent,
        path: 'add'
      },
      {
        component: ProductEditComponent,
        path: 'edit/:id'
      }
    ]
  },
  {
    path: 'orders',
    component: OrdersListComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: '**',
    component: ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ]
})
export class AppRoutingModule { }
