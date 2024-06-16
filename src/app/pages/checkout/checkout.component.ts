import { Component, OnInit } from '@angular/core';
import { EnumLocalStorage } from 'src/app/enums/enumLocalStorage';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  public cart: any[] = [];
  public total: number = NaN;

  constructor() {}

  ngOnInit(): void {
    this.getCartLocal();
  }

  public eliminarCartItem(a: any): void {}

  public getCartLocal(): void {
    let cart = JSON.parse(localStorage.getItem(EnumLocalStorage.CART));
    console.log('🚀 ~ CheckoutComponent ~ getCartLocal ~ cart:', cart);
  }
}
