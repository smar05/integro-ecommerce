import { Injectable } from '@angular/core';
import { EnumGlobalData } from '../enums/enum-global-data';

@Injectable({
  providedIn: 'root',
})
export class GlobalDataService {
  private globalData: { [key: string]: any } = {};

  constructor() {}

  public getData(key: EnumGlobalData): any {
    return this.globalData[key] || null;
  }

  public setData(key: EnumGlobalData, data: any): void {
    this.globalData[key] = data;
  }

  public removeData(key: EnumGlobalData): void {
    if (this.globalData[key]) delete this.globalData[key];
  }
}
