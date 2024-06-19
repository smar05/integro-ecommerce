import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
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
  public f: UntypedFormGroup = this.form.group({
    name: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ'´`-\s]+$/),
        ],
      },
    ],
    idType: ['', { validators: [Validators.required] }],
    idValue: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(14),
          Validators.pattern(/^\d{1,3}( \d{3})*$/),
        ],
      },
    ],
    email: [
      '',
      {
        validarors: [
          Validators.required,
          Validators.email,
          Validators.minLength(5),
          Validators.maxLength(100),
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      },
    ],
    cellphone: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(10),
          Validators.pattern(/^\d+$/),
        ],
      },
    ],
    address: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ.,#\-\/\s]+$/),
        ],
      },
    ],
    country: ['', [Validators.required]],
    state: ['', [Validators.required]],
    city: ['', [Validators.required]],
  });

  //Validaciones personalizadas
  get name() {
    return this.f.controls['name'];
  }

  get idType() {
    return this.f.controls['idType'];
  }

  get idValue() {
    return this.f.controls['idValue'];
  }

  get email() {
    return this.f.controls['email'];
  }

  get cellphone() {
    return this.f.controls['cellphone'];
  }

  get address() {
    return this.f.controls['address'];
  }

  get country() {
    return this.f.controls['country'];
  }

  get state() {
    return this.f.controls['state'];
  }

  get city() {
    return this.f.controls['city'];
  }

  public tiposDeDocumentos: string[] = ['Cedula de identidad', 'Pasaporte'];
  public paises: any[] = [];
  public estados: any[] = [];
  public ciudades: any[] = [];

  constructor(
    private router: Router,
    private globalData: GlobalDataService,
    private form: UntypedFormBuilder
  ) {}

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
