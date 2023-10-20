import { Component, OnInit } from '@angular/core';
import { UrlShopsService } from './services/url-shops.service';
import { IFireStoreRes } from './interfaces/iFireStoreRes';
import { IUrlShops } from './interfaces/iUrlShops';
import { QueryFn } from '@angular/fire/compat/firestore';
import { EnumLocalStorage } from './enums/enumLocalStorage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'integro-ecommerce';
  public showPages: boolean = false; // Para mostrar el contenido

  constructor(private urlShopsService: UrlShopsService) {}

  async ngOnInit(): Promise<void> {
    this.showPages = await this.obtenerIdShop();
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
}
