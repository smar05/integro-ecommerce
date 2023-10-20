import { Injectable } from '@angular/core';
import { FireStoreService } from './fire-store.service';
import { QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IUrlShops } from '../interfaces/iUrlShops';
import { EnumCollecciones } from '../enums/enumCollecciones';

@Injectable({
  providedIn: 'root',
})
export class UrlShopsService {
  private urlCategories: string = EnumCollecciones.URL_SHOPS;

  constructor(private fireStorageService: FireStoreService) {}

  //------------ FireStore---------------//
  /**
   * Se toma la informacion de la coleccion de modelos en url_shops
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof UrlShopsService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlCategories, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   *Tomar un documento de url_shops
   *
   * @param {string} doc
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof UrlShopsService
   */
  public getItemFS(doc: string, qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlCategories, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }

  /**
   * Guardar informacion
   *
   * @param {IUrlShops} data
   * @return {*}  {Promise<any>}
   * @memberof UrlShopsService
   */
  public postDataFS(data: IUrlShops): Promise<any> {
    return this.fireStorageService.post(this.urlCategories, data);
  }

  /**
   * Actualizar
   *
   * @param {string} doc
   * @param {IUrlShops} data
   * @return {*}  {Promise<any>}
   * @memberof UrlShopsService
   */
  public patchDataFS(doc: string, data: IUrlShops): Promise<any> {
    return this.fireStorageService.patch(this.urlCategories, doc, data);
  }

  /**
   * Eliminar
   *
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof UrlShopsService
   */
  public deleteDataFS(doc: string): Promise<any> {
    return this.fireStorageService.delete(this.urlCategories, doc);
  }

  //------------ FireStore---------------//
}
