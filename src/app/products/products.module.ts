import { NgModule } from '@angular/core';
import { ProductsComponent } from './products/products.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { SharedModule } from '../shared/shared.module';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductFormComponent } from './product-form/product-form.component';



@NgModule({
  declarations: [ProductsComponent, ProductsListComponent, ProductDetailsComponent, ProductAddComponent, ProductEditComponent, ProductFormComponent],
  imports: [
    SharedModule
  ],
  exports: [ProductsComponent, ProductsListComponent]
})
export class ProductsModule { }
