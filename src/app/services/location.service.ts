import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ICountries } from '../interfaces/i-contries';
import { IState } from '../interfaces/i-state';
import { ICities } from '../interfaces/i-cities';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private urlLocation: string = environment.urlLocation;
  private apiKeyLocation: string = environment.apiKeyLocation;
  private headers: Headers = new Headers();

  constructor() {
    this.headers.append('X-CSCAPI-KEY', this.apiKeyLocation);
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  /**
   * Consulta de todos los paises
   *
   * @return {*}  {Promise<ICountries[]>}
   * @memberof LocationService
   */
  public async getAllContries(): Promise<ICountries[]> {
    let requestOptions: any = {
      method: 'GET',
      headers: this.headers,
      redirect: 'follow',
    };
    try {
      const response = await fetch(
        `${this.urlLocation}countries`,
        requestOptions
      );
      return response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /**
   * Todos los estados por pais
   *
   * @param {string} iso Iso del pais
   * @return {*}  {Promise<IState[]>}
   * @memberof LocationService
   */
  public async getAllStatesByCountry(iso: string): Promise<IState[]> {
    let requestOptions: any = {
      method: 'GET',
      headers: this.headers,
      redirect: 'follow',
    };
    try {
      const response = await fetch(
        `${this.urlLocation}countries/${iso}/states`,
        requestOptions
      );
      return response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  /**
   * Todas las ciudades por pais y estado
   *
   * @param {string} isoCountry Iso del pais
   * @param {string} isoState Iso del estado
   * @return {*}  {Promise<ICities[]>}
   * @memberof LocationService
   */
  public async getAllCitiesByCountryAndState(
    isoCountry: string,
    isoState: string
  ): Promise<ICities[]> {
    let requestOptions: any = {
      method: 'GET',
      headers: this.headers,
      redirect: 'follow',
    };
    try {
      const response = await fetch(
        `${this.urlLocation}countries/${isoCountry}/states/${isoState}/cities`,
        requestOptions
      );
      return response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
