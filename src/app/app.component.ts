import { Component, OnInit } from '@angular/core';
import { UrlShopsService } from './services/url-shops.service';
import { IFireStoreRes } from './interfaces/iFireStoreRes';
import { IUrlShops } from './interfaces/iUrlShops';
import { QueryFn } from '@angular/fire/compat/firestore';
import { EnumLocalStorage } from './enums/enumLocalStorage';
import { ShopsDataService } from './services/shops-data.service';
import { IShopsData } from './interfaces/i-shops-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'integro-ecommerce';
  public showPages: boolean = false; // Para mostrar el contenido

  constructor(
    private urlShopsService: UrlShopsService,
    private shopsDataService: ShopsDataService
  ) {}

  async ngOnInit(): Promise<void> {
    let show: boolean = false;
    show = await this.obtenerIdShop();
    await this.getShopsData();

    this.showPages = show;
  }

  /**
   * Se obtiene el id de la tienda en base a su url
   *
   * @private
   * @return {*}  {Promise<boolean>}
   * @memberof AppComponent
   */
  private async obtenerIdShop(): Promise<boolean> {
    localStorage.clear();

    // Se obtiene la url
    let url: string = document.location.host;

    // Se consulta el id de lcomercio por su url
    let qf: QueryFn = (ref) => ref.where('url', '==', url).limit(1);
    let res: IFireStoreRes[] = [];

    try {
      res = await this.urlShopsService.getDataFS(qf).toPromise();
    } catch (error) {
      return false;
    }

    let data: IUrlShops = { id: res[0].id, ...res[0].data };

    localStorage.setItem(EnumLocalStorage.ID_SHOP, data.idShop);
    // Se muestra el contenido del aplicativo
    return true;
  }

  private async getShopsData(): Promise<void> {
    let res: IFireStoreRes[] = [];
    let shopData: IShopsData = {} as any;
    let qf: QueryFn = (ref) => ref.limit(1);

    try {
      res = await this.shopsDataService.getDataFS(qf).toPromise();
    } catch (error) {
      throw new Error(error);
    }

    shopData = { id: res[0].id, ...res[0].data };

    localStorage.setItem(EnumLocalStorage.SHOP_DATA, JSON.stringify(shopData));

    let html: HTMLElement = document.documentElement;

    html.style.border = `12px solid ${shopData.border_color || 'black'}`;
  }
}
