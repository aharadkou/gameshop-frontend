import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { CartService } from 'src/app/common-services/services/cart.service';
import { AuthService } from 'src/app/common-services/services/auth.service';
import { Role } from 'src/app/common-services/models/role.enum';

@Component({
  selector: 'gs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  addedProductCount$ = this.cartSerivice.$addedProductCount;
  user$ = this.authService.userProfile$;
  userRoles$ = this.authService.userRoles$;
  role = Role;

  constructor(private cartSerivice: CartService, public authService: AuthService) { }

  @ViewChild('menu') menu: MatMenuTrigger;

  ngOnInit() {
  }

  clearCart() {
    this.cartSerivice.clearCart();
  }

  getOptionName(url: string) {
    if (url) {
      const pathes = url.split('/');
      const lastPath = pathes[pathes.length - 1];
      return lastPath.charAt(0).toUpperCase() + lastPath.slice(1);
    }
  }

  logout() {
    this.authService.logout();
  }

}
