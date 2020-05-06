import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common-services/interfaces/product.model';
import { ActivatedRoute } from '@angular/router';
import { ProductFacade } from '../product-facade';

@Component({
  selector: 'gs-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  product: Product;

  constructor(
    private productFacade: ProductFacade,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.productFacade.getProductFromRoute(this.activatedRoute).subscribe(product => this.product = product);
  }

  editProduct(productData: FormData) {
    productData.append('id', '' + this.product.id);
    productData.append('imageUrl', this.product.imageUrl ? this.product.imageUrl.toString() : '');
    this.productFacade.updateProduct(productData).subscribe();
  }

}
