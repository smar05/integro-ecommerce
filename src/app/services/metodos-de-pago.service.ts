import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FireStoreService } from './fire-store.service';
import { QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MetodosDePagoService {
  private urlMetodosDePago: string = environment.collections.metodos_de_pago;

  constructor(private fireStorageService: FireStoreService) {}

  //------------ FireStorage---------------//
  /**
   * Se toma la informacion de la coleccion en Firebase
   *
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof MetodosDePagoService
   */
  public getDataFS(qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getData(this.urlMetodosDePago, qf)
      .pipe(this.fireStorageService.mapForPipe('many'));
  }

  /**
   * Tomar un documento
   *
   * @param {string} doc
   * @param {QueryFn} [qf=null]
   * @return {*}  {Observable<any>}
   * @memberof MetodosDePagoService
   */
  public getItemFS(doc: string, qf: QueryFn = null): Observable<any> {
    return this.fireStorageService
      .getItem(this.urlMetodosDePago, doc, qf)
      .pipe(this.fireStorageService.mapForPipe('one'));
  }
}
