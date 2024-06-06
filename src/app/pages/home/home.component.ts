import { Component, OnInit } from '@angular/core';
import { EnumLocalStorage } from 'src/app/enums/enumLocalStorage';
import { IFireStoreRes } from 'src/app/interfaces/iFireStoreRes';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService
      .getDataFS()
      .toPromise()
      .then((resp: IFireStoreRes) => {
        console.log('🚀 ~ HomeComponent ~ .then ~ resp:', resp);
      });
  }
}
