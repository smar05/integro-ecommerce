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
import { ICities } from 'src/app/interfaces/i-cities';
import { ICountries } from 'src/app/interfaces/i-contries';
import { Iproducts } from 'src/app/interfaces/i-products';
import { IState } from 'src/app/interfaces/i-state';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { LocationService } from 'src/app/services/location.service';

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
          Validators.pattern(/^\d+$/),
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
  public allCountries: ICountries[] = [];
  public allStatesByCountry: IState[] = [];
  public allCities: ICities[] = [];

  constructor(
    private router: Router,
    private globalData: GlobalDataService,
    private form: UntypedFormBuilder,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.getCartLocal();
    this.getCountries();
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

  private async getCountries(): Promise<void> {
    try {
      this.allCountries = await this.locationService.getAllContries();
    } catch (error) {
      this.allCountries = [];
    }
  }

  public async countryChange(): Promise<void> {
    try {
      this.state.setValue(null);
      this.city.setValue(null);
      this.allStatesByCountry =
        await this.locationService.getAllStatesByCountry(this.country.value);
    } catch (error) {
      this.state.setValue(null);
      this.city.setValue(null);
      this.allStatesByCountry = [];
    }
  }

  public async stateChange(): Promise<void> {
    try {
      this.city.setValue(null);
      this.allCities = await this.locationService.getAllCitiesByCountryAndState(
        this.country.value,
        this.state.value
      );
    } catch (error) {
      this.state.setValue(null);
      this.city.setValue(null);
      this.allCities = [];
    }
  }
}
