import { Injectable } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EnumLocalStorage } from '../enums/enumLocalStorage';
import { functions, IQueryFnWhere } from '../helpers/functions';
import { Iusers } from '../interfaces/iusers';
import { FireStoreService } from './fire-store.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private urlUsers: string = environment.collections.users;

  constructor(private fireStorageService: FireStoreService) {}

  /**
   *
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof UsersService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    qf = functions.editQF(qf, {
      path: 'idShop',
      operation: '==',
      value: localStorage.getItem(EnumLocalStorage.ID_SHOP),
    } as IQueryFnWhere);

    return this.fireStorageService
      .getData(this.urlUsers, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   *
   *
   * @param {Iusers} data
   * @return {*}  {Promise<any>}
   * @memberof UsersService
   */
  public postDataFS(data: Iusers): Promise<any> {
    return this.fireStorageService.post(this.urlUsers, data);
  }

  /**
   *
   *
   * @param {string} doc
   * @param {Iusers} data
   * @return {*}  {Promise<any>}
   * @memberof UsersService
   */
  public patchDataFS(doc: string, data: Iusers): Promise<any> {
    return this.fireStorageService.patch(this.urlUsers, doc, data);
  }
}
