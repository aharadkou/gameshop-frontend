import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { CartService } from 'src/app/common-services/services/cart.service';

@Component({
  selector: 'gs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  $addedProductCount = this.cartSerivice.$addedProductCount;

  constructor(private cartSerivice: CartService) { }

  @ViewChild('menu') menu: MatMenuTrigger;

  ngOnInit() {
  }

  clearCart() {
    this.cartSerivice.clearCart();
  }

}
