import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FireStoreService } from './fire-store.service';
import { Isales } from '../interfaces/i-sales';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private urlSales: string = environment.collections.sales;

  constructor(private fireStorageService: FireStoreService) {}

  /**
   *
   *
   * @param {Isales} data
   * @return {*}  {Promise<any>}
   * @memberof SalesService
   */
  public postDataFS(data: Isales): Promise<any> {
    return this.fireStorageService.post(this.urlSales, data);
  }
}
