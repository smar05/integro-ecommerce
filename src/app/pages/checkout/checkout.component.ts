import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  public cart: any[] = [];
  public total: number = NaN;

  constructor() {}

  ngOnInit(): void {}

  public eliminarCartItem(a: any): void {}
}
