import { Component, OnInit } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService
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
}
