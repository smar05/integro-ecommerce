// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { EnumRutas } from 'src/app/enums/enum-rutas';

const apiKey: string = 'AIzaSyCtV65qh8OjmZ75uNDO1zw0lYlPYsrnjsc';
const urlProd: string = 'https://integro-shop.web.app';

export const environment = {
  production: false,
  urlLogin: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
  urlGetUser: `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
  urlRefreshToken: `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
  urlStorage: {
    img: `/img`,
  },
  firebaseConfig: {
    apiKey: apiKey,
    authDomain: 'integro-group.firebaseapp.com',
    projectId: 'integro-group',
    storageBucket: 'integro-group.appspot.com',
    messagingSenderId: '387701533633',
    appId: '1:387701533633:web:716a4376a5c6ce52381d40',
    measurementId: 'G-7N5RZ3Q7FE',
  },
  collections: {
    categories: 'categories',
    products: 'products',
    subCategories: 'sub-categories',
    users: 'users',
    counts: 'counts', // Coleccion por fuera de la agrupacion por cuentas
    orders: 'orders',
    disputes: 'disputes',
    messages: 'messages',
    sales: 'sales',
    stores: 'stores',
    versions: 'versions',
    alerts: 'alerts',
    url_shops: 'url_shops',
    shops_data: 'shops_data',
    metodos_de_pago: 'metodos_de_pago',
  },
  payUCredentials: {
    merchantId: '777287',
    action: 'https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/',
    accountId: {
      col: '512321',
    },
    responseUrl: `${urlProd}/#/${EnumRutas.CHECKOUT}`,
    confirmationUrl: 'http://www.test.com/confirmation',
    apiKey: '4Vj8eK4rloUd272L48hsrarnUA',
    test: 1,
  },
  version: '1.0.0',
  apiKeyLocation: 'dU1Pc1lYSnBVZDVqcVpSYjhVSkswTGhWTWlRWVZaUHpIdFBuemhINA==',
  urlLocation: `https://api.countrystatecity.in/v1/`,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
