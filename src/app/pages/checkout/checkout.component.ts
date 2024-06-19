import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnumGlobalData } from 'src/app/enums/enum-global-data';
import { EnumRutas } from 'src/app/enums/enum-rutas';
import { ICart } from 'src/app/interfaces/i-cart';
import { Iproducts } from 'src/app/interfaces/i-products';
import { GlobalDataService } from 'src/app/services/global-data.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  public cart: ICart[] = [];
  public total: number = NaN;

  constructor(private router: Router, private globalData: GlobalDataService) {}

  ngOnInit(): void {
    this.getCartLocal();
  }

  public eliminarCartItem(cartItem: ICart): void {
    let index: number = this.cart.findIndex(
      (cart: ICart) => cart.product.id === cartItem.product.id
    );

    if (index < 0) return;

    this.cart.splice(index, 1);

    this.globalData.setData(EnumGlobalData.CART, this.cart);
  }

  public getCartLocal(): void {
    this.cart = this.globalData.getData(EnumGlobalData.CART) || [];
  }

  public goToProduct(product: Iproducts | any): void {
    this.router.navigate([`/${EnumRutas.PRODUCT}/${product.url}`]);
  }
}
