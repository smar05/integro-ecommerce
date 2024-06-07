import { Component, OnInit } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import { EnumLocalStorage } from 'src/app/enums/enumLocalStorage';
import { EnumProductImg, Iproducts } from 'src/app/interfaces/i-products';
import { IFireStoreRes } from 'src/app/interfaces/iFireStoreRes';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public products: Iproducts[] = [];
  public productsImages: Map<string, string> = new Map();

  constructor(private productsService: ProductsService) {}

  async ngOnInit(): Promise<void> {
    await this.getProducts();
  }

  private async getProducts(): Promise<void> {
    let resp: IFireStoreRes[] = [];
    let qf: QueryFn = (ref) => ref.limit(30);

    try {
      resp = await this.productsService.getDataFS(qf).toPromise();
    } catch (error) {
      throw new Error(error);
    }

    this.products = resp.map((r: IFireStoreRes) => {
      return { id: r.id, ...r.data };
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
}
