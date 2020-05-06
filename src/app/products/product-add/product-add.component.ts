import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common-services/interfaces/product.model';
import { ProductFacade } from '../product-facade';

@Component({
  selector: 'gs-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {

  product: Product;

  constructor(private productFacade: ProductFacade) { }

  ngOnInit() {
    this.product = {
      title: '',
      categories: [],
      description: '',
      price: undefined
    };
  }

  addProduct(productData: FormData) {
    this.productFacade.addProduct(productData).subscribe();
  }

}
