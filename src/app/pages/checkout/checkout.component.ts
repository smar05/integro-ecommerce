import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'md5-typescript';
import { EnumGlobalData } from 'src/app/enums/enum-global-data';
import { EnumPayMethods } from 'src/app/enums/enum-pay-methods';
import { EnumPayPalStatus } from 'src/app/enums/enum-paypal-status';
import { EnumRutas } from 'src/app/enums/enum-rutas';
import { EnumLocalStorage } from 'src/app/enums/enumLocalStorage';
import { alerts } from 'src/app/helpers/alerts';
import { ICart } from 'src/app/interfaces/i-cart';
import { ICities } from 'src/app/interfaces/i-cities';
import { ICountries } from 'src/app/interfaces/i-contries';
import {
  EnumMetodosDePagoStatus,
  IMetodosDePago,
} from 'src/app/interfaces/i-metodos-pago';
import {
  EnumOrderProcessStatus,
  EnumOrderStatus,
  IorderProcess,
  Iorders,
} from 'src/app/interfaces/i-orders';
import { Iproducts } from 'src/app/interfaces/i-products';
import { EnumSalesStatus, Isales } from 'src/app/interfaces/i-sales';
import { IState } from 'src/app/interfaces/i-state';
import { IFireStoreRes } from 'src/app/interfaces/iFireStoreRes';
import { Iusers } from 'src/app/interfaces/iusers';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { LocationService } from 'src/app/services/location.service';
import { MetodosDePagoService } from 'src/app/services/metodos-de-pago.service';
import { OrdersService } from 'src/app/services/orders.service';
import { SalesService } from 'src/app/services/sales.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';

declare var paypal: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  @ViewChild('paypal', { static: true })
  paypalElement!: ElementRef;
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
          Validators.minLength(5),
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

  public tiposDeDocumentos: { name: string; value: string }[] = [
    { name: 'Cedula de identidad', value: 'CC' },
    { name: 'Pasaporte', value: 'P' },
  ];
  public allCountries: ICountries[] = [];
  public allStatesByCountry: IState[] = [];
  public allCities: ICities[] = [];
  public metodosDePago: IMetodosDePago[] = null;
  public payMethod: string = '';

  constructor(
    private router: Router,
    private globalData: GlobalDataService,
    private form: UntypedFormBuilder,
    private locationService: LocationService,
    private metodosDePagoService: MetodosDePagoService,
    private ordersService: OrdersService,
    private salesService: SalesService,
    private usersService: UsersService
  ) {}

  async ngOnInit(): Promise<void> {
    this.getCartLocal();
    this.getCountries();
    await this.getMetodosDePago();

    this.paypalData();
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

  public findMetodoDePago(metodo: EnumPayMethods | string): boolean {
    if (!(this.metodosDePago && this.metodosDePago.length > 0)) return false;

    return this.metodosDePago.find((mp: IMetodosDePago) => mp.name === metodo)
      ? true
      : false;
  }

  private async getMetodosDePago(): Promise<void> {
    let qf: QueryFn = (ref) =>
      ref.where('status', '==', EnumMetodosDePagoStatus.ACTIVE);

    let res: IFireStoreRes[] = null;
    try {
      res = await this.metodosDePagoService.getDataFS(qf).toPromise();
    } catch (error) {
      console.error('Error: ', error);

      throw error;
    }

    if (!res) return null;

    this.metodosDePago = res.map((r: IFireStoreRes) => {
      return { id: r.id, ...r.data };
    });
  }

  public pagarPayU(): void {
    let currency: string = 'USD';
    let referenceCode: number = Math.ceil(Math.random() * 1000000);
    let firmaPayU: string = Md5.init(
      `${environment.payUCredentials.apiKey}~${environment.payUCredentials.merchantId}~${referenceCode}~${this.total}~${currency}`
    );
    let total: number = this.calcularTotal();
    console.log('🚀 ~ CheckoutComponent ~ pagarPayU ~ total:', total);

    let formPayU: string = `    
    <form method="post" action="${environment.payUCredentials.action}">
      <input name="merchantId"      type="hidden"  value="${environment.payUCredentials.merchantId}"   >
      <input name="accountId"       type="hidden"  value="${environment.payUCredentials.accountId.col}" >
      <input name="description"     type="hidden"  value="OnlyGram"  >
      <input name="referenceCode"   type="hidden"  value="${referenceCode}" >
      <input name="amount"          type="hidden"  value="${total}"   >
      <input name="tax"             type="hidden"  value="0"  >
      <input name="taxReturnBase"   type="hidden"  value="0" >
      <input name="currency"        type="hidden"  value="${currency}" >
      <input name="signature"       type="hidden"  value="${firmaPayU}"  >
      <input name="test"            type="hidden"  value="${environment.payUCredentials.test}" >
      <input name="buyerEmail"      type="hidden"  value="${this.email.value}" >
      <input name="responseUrl"     type="hidden"  value="${environment.payUCredentials.responseUrl}" >
      <input name="confirmationUrl" type="hidden"  value="${environment.payUCredentials.confirmationUrl}" >
      <input name="Submit"          type="submit"  value="Continuar"  class"btn btn-primary bg-principal p-0 px-5" id="payu-button">
    </form>  
    `;

    alerts.html('Pago por PayU', 'info', formPayU);

    let payBtn = document.querySelector('#payu-button');
    payBtn.addEventListener('click', function () {
      localStorage.setItem(
        EnumLocalStorage.PAYU_PROCESO,
        new Date().toISOString()
      );
    });
  }

  public calcularTotal(): number {
    if (this.cart?.length <= 0) return NaN;

    return this.cart.reduce((total: number, cart: ICart) => {
      return total + cart.product.price * (cart.quantity as number);
    }, 0);
  }

  public inputQuantity(index: number, event: Event): void {
    let cartItem: ICart = this.cart[index];

    // Validar que la cantidad sea mayor a 0
    let cantidad: number = (event.target as any).value;
    if (cantidad <= 0) {
      (event.target as any).value = 1;
      cartItem.quantity = 1;
      return;
    }

    if (!cartItem) return;
    if (cartItem.product.stock < cantidad) {
      (event.target as any).value = cartItem.product.stock;
      cartItem.quantity = cartItem.product.stock;
      return;
    }
  }

  /**
   * Metodo para el boton de paypal
   *
   * @private
   * @memberof CheckoutComponent
   */
  private paypalData(): void {
    paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                description: 'Compra en OnlyGram',
                amount: {
                  currency_code: 'USD',
                  value: this.calcularTotal(),
                },
              },
            ],
          });
        },
        onApprove: async (data: any, actions: any) => {
          let orderPaypal: any = null;

          try {
            orderPaypal = await actions.order.capture();
          } catch (error) {
            throw error;
          }

          if (orderPaypal.status != EnumPayPalStatus.COMPLETED)
            throw 'Paypal error';

          const idShop: string = localStorage.getItem(EnumLocalStorage.ID_SHOP);

          this.cart.forEach(async (cart: ICart) => {
            let processOrder: IorderProcess[] = [
              {
                stage: 'reviewed',
                status: EnumOrderProcessStatus.pending,
                comment: '',
                date: new Date().toISOString(),
              },
              { stage: 'sent', status: null, comment: '', date: '' },
              { stage: 'delivered', status: null, comment: '', date: '' },
            ];
            let order: Iorders = {
              address: this.address.value,
              city: this.city.value,
              country: this.country.value,
              email: this.email.value,
              phone: this.cellphone.value,
              price: String(this.calcularTotal()),
              process: JSON.stringify(processOrder),
              status: EnumOrderStatus.pending,
              idShop: localStorage.getItem(EnumLocalStorage.ID_SHOP),
              details: null,
              product: cart.product.name,
              category: cart.product.category,
              quantity: cart.quantity,
              url: cart.product.url,
              user: this.email.value,
            };

            let resOrder = await this.ordersService.postDataFS(order);

            let sale: Isales = {
              date: new Date(),
              id_order: resOrder.id,
              id_payment: orderPaypal.id,
              payment_method: EnumPayMethods.PAYPAL,
              product: cart.product.id,
              quantity: cart.quantity,
              status: EnumSalesStatus.pending,
              total: cart.quantity * cart.product.price,
              unit_price: cart.product.price,
              idShop,
            };

            await this.salesService.postDataFS(sale);
          });

          let resUser: IFireStoreRes[];
          try {
            let qf: QueryFn = (ref) =>
              ref.where('email', '==', this.email.value);
            resUser = await this.usersService.getDataFS(qf).toPromise();
          } catch (error) {}

          const userData: Iusers = {
            address: this.address.value,
            city: this.city.value,
            country: this.country.value,
            state: this.state.value,
            name: this.name.value,
            email: this.email.value,
            phone: this.cellphone.value,
            idType: this.idType.value,
            idValue: this.idValue.value,
            idShop: localStorage.getItem(EnumLocalStorage.ID_SHOP),
          };
          if (resUser && resUser.length > 0 && resUser[0].id) {
            let userDb: Iusers = { ...resUser[0].data, id: resUser[0].id };
            this.usersService.patchDataFS(userDb.id, userData);
          } else {
            this.usersService.postDataFS(userData);
          }

          alerts.basicAlert(
            'Finalizado',
            'La transaccion a finalizado',
            'success'
          );
        },
        onError: (err: any) => {
          alerts.basicAlert(
            'Pago erroneo',
            'Ha ocurrido un problema en el pago',
            'error'
          );
          console.error(err);
        },
      })
      .render(this.paypalElement.nativeElement);
  }
}
