export interface Iorders {
  id: string;
  address: string;
  city: string;
  country: string;
  details: string;
  email: string;
  image?: string;
  info?: string;
  phone: string;
  price: string;
  process: string;
  status: string;
  idShop: string;
}

export enum EnumOrderStatus {
  pending = 'pending',
  delivered = 'delivered',
}

export enum EnumOrderProcessStatus {
  pending = 'pending',
  ok = 'ok',
  delivered = 'delivered',
}
