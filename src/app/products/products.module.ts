import { NgModule } from '@angular/core';
import { ProductsListComponent } from './products-list/products-list.component';
import { SharedModule } from '../shared/shared.module';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { CategoryInputComponent } from './product-form/category-input/category-input.component';


@NgModule({
  declarations: [
    ProductsListComponent,
    ProductDetailsComponent,
    ProductAddComponent,
    ProductEditComponent,
    ProductFormComponent,
    CategoryInputComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [ProductsListComponent]
})
export class ProductsModule { }
