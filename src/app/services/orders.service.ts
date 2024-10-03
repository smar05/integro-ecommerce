import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FireStoreService } from './fire-store.service';
import { Iorders } from '../interfaces/i-orders';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private urlOrders: string = environment.collections.orders;

  constructor(private fireStorageService: FireStoreService) {}

  /**
   *
   *
   * @param {Iorders} data
   * @return {*}  {Promise<any>}
   * @memberof OrdersService
   */
  public postDataFS(data: Iorders): Promise<any> {
    return this.fireStorageService.post(this.urlOrders, data);
  }

  //------------ FireStorage---------------//
}
