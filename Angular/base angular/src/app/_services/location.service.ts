import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}

  // Country
  getAllCountryList(data: any) {
    return this.http.post<any>(CONFIG.getAllCountryURL, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getCountryById(id: number) {
    return this.http.get<any>(CONFIG.getCountryByIdURL + id).pipe(
      map((data) => {
        return data;
      })
    );
  }

  updateCountry(data: any, id: number) {
    return this.http.put<any>(CONFIG.updateCountryURL + id, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  createCountry(data: any) {
    return this.http.post<any>(CONFIG.createCountryURL, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  changeCountryStatus(status: string, id: number) {
    return this.http
      .put<any>(CONFIG.changeCountryStatusURL, { uuid: id, status: status })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  deleteCountry(id: number) {
    return this.http.delete<any>(CONFIG.deleteCountryURL + id).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // State
  getAllStateList(data: any) {
    return this.http.post<any>(CONFIG.getAllStateURL, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getStateById(id: number) {
    return this.http.get<any>(CONFIG.getStateByIdURL + id).pipe(
      map((data) => {
        return data;
      })
    );
  }

  updateState(data: any, id: number) {
    return this.http.put<any>(CONFIG.updateStateURL + id, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  createState(data: any) {
    return this.http.post<any>(CONFIG.createStateURL, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  changeStateStatus(status: string, id: number) {
    return this.http
      .put<any>(CONFIG.changeStateStatusURL, { uuid: id, status: status })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  deleteState(id: number) {
    return this.http.delete<any>(CONFIG.deleteStateURL + id).pipe(
      map((response) => {
        return response;
      })
    );
  }

  // City
  getAllCityList(data: any) {
    return this.http.post<any>(CONFIG.getAllCityURL, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getCityById(id: number) {
    return this.http.get<any>(CONFIG.getCityByIdURL + id).pipe(
      map((data) => {
        return data;
      })
    );
  }

  updateCity(data: any, id: number) {
    return this.http.put<any>(CONFIG.updateCityURL + id, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  createCity(data: any) {
    return this.http.post<any>(CONFIG.createCityURL, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  changeCityStatus(status: string, id: number) {
    return this.http
      .put<any>(CONFIG.changeCityStatusURL, { uuid: id, status: status })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  deleteCity(id: number) {
    return this.http.delete<any>(CONFIG.deleteCityURL + id).pipe(
      map((response) => {
        return response;
      })
    );
  }
  getActiveCountry() {
    return this.http.get<any>(CONFIG.getActiveCountryURL).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getActiveState(countryId) {
    return this.http
      .post<any>(CONFIG.getActiveStateURL, { country_id: countryId })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
