import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { CONFIGCONSTANTS } from '../config/app-constants';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  setting: any = {};
  constructor(private http: HttpClient, @Inject(DOCUMENT) private _document: HTMLDocument) {}

  /* Get Response of the Settings Data */
  getSettingsDataURL() {
    /* added {} as empty parameter due POST method but need to remove {} and replace POST Method to GET Method */
    return this.http.post<any>(CONFIG.getSettingsDataURL, {}).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /* SAVE Data to the Settings Data */
  updateSettingsDataURL(SettingsData: any) {
    return this.http.post<any>(CONFIG.getSettingsSaveDataURL, SettingsData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /* Get Image URL */
  getSettingsImageDataURL() {
    return this.http.get<any>(CONFIG.getSettingsImageDataURL).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /* Delete Image on basis of ID value */
  removeImage(id: number) {
    return this.http.get<any>(CONFIG.getSettingsRemoveImageURL + id).pipe(
      map((response) => {
        return response;
      })
    );
  }
  changeFavicon(href: string): void {
    this._document.getElementById('appFavicon').setAttribute('href', href);
  }
  setSettingsData(sitename, logo, favicon) {
    let site, log, fav;
    site = sitename ? sitename : CONFIGCONSTANTS.siteName;
    log = logo ? logo : 'assets/img/brand/angular_logo.png';
    fav = favicon ? favicon : 'assets/img/brand/angular_logo_small.png';

    this.setting['sitename'] = site;
    this.setting['logo'] = log;
    this.setting['favicon'] = fav;
    localStorage.setItem('settings', JSON.stringify(this.setting));
  }
}
