import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FireStoreService } from './fire-store.service';
import { QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IQueryFnWhere, functions } from '../helpers/functions';
import { EnumLocalStorage } from '../enums/enumLocalStorage';
import { IShopsData } from '../interfaces/i-shops-data';

@Injectable({
  providedIn: 'root',
})
export class ShopsDataService {
  private urlShopsData: string = environment.collections.shops_data;

  constructor(private fireStorageService: FireStoreService) {}

  /**
   *
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof ShopsDataService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    qf = functions.editQF(qf, {
      path: 'idShop',
      operation: '==',
      value: localStorage.getItem(EnumLocalStorage.ID_SHOP),
    } as IQueryFnWhere);

    return this.fireStorageService
      .getData(this.urlShopsData, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   *
   *
   * @param {string} doc
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof ShopsDataService
   */
  public getItemFS(doc: string, qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlShopsData, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }

  /**
   *
   *
   * @param {IShopsData} data
   * @return {*}  {Promise<any>}
   * @memberof ProductsService
   */
  public postDataFS(data: IShopsData): Promise<any> {
    return this.fireStorageService.post(this.urlShopsData, data);
  }

  /**
   *
   *
   * @param {string} doc
   * @param {IShopsData} data
   * @return {*}  {Promise<any>}
   * @memberof ShopsDataService
   */
  public patchDataFS(doc: string, data: IShopsData): Promise<any> {
    return this.fireStorageService.patch(this.urlShopsData, doc, data);
  }

  /**
   *
   *
   * @param {string} doc
   * @return {*}  {Promise<any>}
   * @memberof ShopsDataService
   */
  public deleteDataFS(doc: string): Promise<any> {
    return this.fireStorageService.delete(this.urlShopsData, doc);
  }
}
