export interface Isales {
  id: string;
  date: Date;
  id_order: string;
  id_payment: string;
  payment_method: string;
  product: string;
  quantity: number;
  status: string;
  total: number;
  unit_price: number;
  idShop: string;
}

export enum EnumSalesStatus {
  success = 'success',
  test = 'test',
  pending = 'pending',
}
