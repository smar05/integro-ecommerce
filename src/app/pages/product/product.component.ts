import { Component, OnInit } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { EnumRutas } from 'src/app/enums/enum-rutas';
import { EnumLocalStorage } from 'src/app/enums/enumLocalStorage';
import { ICart } from 'src/app/interfaces/i-cart';
import {
  EnumProductImg,
  EnumProductReviewType,
  Iproducts,
} from 'src/app/interfaces/i-products';
import { IFireStoreRes } from 'src/app/interfaces/iFireStoreRes';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  private urlProduct: string = '';
  public product: Iproducts = null;
  public urlImg: string = '';
  public quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.urlProduct = this.route.snapshot.paramMap.get('url');
    this.getProduct();
  }

  private getProduct(): void {
    let qf: QueryFn = (ref) =>
      ref
        .where('url', '==', this.urlProduct)
        .where('delete', '==', false)
        .where('feedback', '==', EnumProductReviewType.approved)
        .where('stock', '>=', 1)
        .limit(1);

    this.productService
      .getDataFS(qf)
      .subscribe(async (res: IFireStoreRes[]) => {
        this.product = { id: res[0].id, ...res[0].data };
        if (this.product.tags)
          this.product.tags = JSON.parse(this.product.tags);
        let url: string = `${this.product.id}/${EnumProductImg.main}`;

        if (url) this.urlImg = await this.productService.getImage(url);
      });
  }

  public validarQuantity(): boolean {
    if (
      this.product &&
      (this.quantity > this.product.stock || this.quantity <= 0)
    )
      return false;

    return true;
  }

  public addCarrito(): void {
    if (!this.validarQuantity()) return;

    let carrito: ICart[] = [];

    // Obtener el carrito guardado en local
    if (localStorage.getItem(EnumLocalStorage.CART)) {
      let carritoLocal: ICart[] = JSON.parse(
        localStorage.getItem(EnumLocalStorage.CART)
      );
      carrito.concat(carritoLocal);
    }

    // Buscar si este producto ya se guardo en el carrito
    let index: number = carrito.findIndex(
      (cart: ICart) => cart.product.id === this.product.id
    );
    if (index) carrito.splice(index, 1);

    // Guardar el producto en el carrito
    carrito.push({ product: this.product, quantity: this.quantity } as ICart);
    localStorage.setItem(EnumLocalStorage.CART, JSON.stringify(carrito));

    this.router.navigate([`/${EnumRutas.CHECKOUT}`]);
  }
}
