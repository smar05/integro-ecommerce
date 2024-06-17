import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnumRutas } from 'src/app/enums/enum-rutas';
import { EnumLocalStorage } from 'src/app/enums/enumLocalStorage';
import { ICart } from 'src/app/interfaces/i-cart';
import { Iproducts } from 'src/app/interfaces/i-products';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  public cart: ICart[] = [];
  public total: number = NaN;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getCartLocal();
  }

  public eliminarCartItem(a: any): void {}

  public getCartLocal(): void {
    this.cart = JSON.parse(localStorage.getItem(EnumLocalStorage.CART)) || [];
  }

  public goToProduct(product: Iproducts | any): void {
    this.router.navigate([`/${EnumRutas.PRODUCT}/${product.url}`]);
  }
}
