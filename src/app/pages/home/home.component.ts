import { Component, OnInit } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { EnumGlobalData } from 'src/app/enums/enum-global-data';
import { EnumRutas } from 'src/app/enums/enum-rutas';
import { EnumLocalStorage } from 'src/app/enums/enumLocalStorage';
import { ICart } from 'src/app/interfaces/i-cart';
import {
  EnumProductImg,
  EnumProductReviewType,
  Iproducts,
} from 'src/app/interfaces/i-products';
import { IShopsData } from 'src/app/interfaces/i-shops-data';
import { IFireStoreRes } from 'src/app/interfaces/iFireStoreRes';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public products: Iproducts[] = [];
  public productsImages: Map<string, string> = new Map();
  public shopData: IShopsData = null;

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private globalData: GlobalDataService
  ) {}

  async ngOnInit(): Promise<void> {
    this.editHome();
    await this.getProducts();
  }

  private editHome(): void {
    this.shopData = JSON.parse(
      localStorage.getItem(EnumLocalStorage.SHOP_DATA) || null
    );
    let home: HTMLElement = document.querySelector('#home');

    home.style.backgroundColor = this.shopData.back_color || 'white';
  }

  private async getProducts(): Promise<void> {
    let resp: IFireStoreRes[] = [];
    let qf: QueryFn = (ref) =>
      ref
        .where('delete', '==', false)
        .where('feedback', '==', EnumProductReviewType.approved)
        .where('stock', '>=', 1)
        .limit(30);

    try {
      resp = await this.productsService.getDataFS(qf).toPromise();
    } catch (error) {
      throw new Error(error);
    }

    this.products = resp.map((r: IFireStoreRes) => {
      let product: Iproducts = { id: r.id, ...r.data };
      if (product.offer) product.offer = JSON.parse(product.offer);
      return product;
    });

    this.products.forEach(async (product: Iproducts) => {
      await this.getProductMainImage(product, EnumProductImg.main); //Imagen principal
    });
  }

  public async getProductMainImage(
    product: Iproducts,
    type: string
  ): Promise<void> {
    let urlImage: string = '';

    if (product.id) {
      let url: string = type ? `${product.id}/${type}` : '';
      let set: string = type ? `${product.id}-${type}` : '';

      if (url) urlImage = await this.productsService.getImage(url);

      if (urlImage) {
        this.productsImages.set(set, urlImage);
      } else {
        this.productsImages.set(set, '');
      }
    }
  }

  public goToProduct(id: string): void {
    this.router.navigate([`/${EnumRutas.PRODUCT}/${id}`]);
  }

  public validarQuantity(product: Iproducts): boolean {
    if (product && 1 > product.stock) return false;

    return true;
  }

  public addCarrito(product: Iproducts): void {
    if (!this.validarQuantity(product)) return;

    let carrito: ICart[] = [];

    // Obtener el carrito guardado en local
    let cartData: ICart[] = this.globalData.getData(EnumGlobalData.CART);
    if (cartData) carrito = cartData;

    // Buscar si este producto ya se guardo en el carrito
    let index: number = carrito.findIndex(
      (cart: ICart) => cart.product.id === product.id
    );
    if (index >= 0) carrito.splice(index, 1);

    // Guardar el producto en el carrito
    let price: number = this.getPriceProduct(product);
    if (price) product.price = price; // Si hay descuento en el producto
    carrito.push({ product: product, quantity: 1 } as ICart);
    this.globalData.setData(EnumGlobalData.CART, carrito);

    this.router.navigate([`/${EnumRutas.CHECKOUT}`]);
  }

  public getPriceProduct(product: Iproducts): number {
    return this.productsService.calculoPrecioOferta(product);
  }
}
