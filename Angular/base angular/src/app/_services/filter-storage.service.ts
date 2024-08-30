import { Injectable } from '@angular/core';
import { persistPageWiseFilter } from './../config/app-constants';

@Injectable({
  providedIn: 'root',
})
export class FilterStorageService {
  constructor() {}

  saveState(key, value, forceFullySave: boolean = false) {
    if (!persistPageWiseFilter && forceFullySave === false) return;
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  getState(key, defaultValue, forceFullyGet: boolean = false) {
    if (!persistPageWiseFilter && forceFullyGet === false) return defaultValue;
    const data = sessionStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    } else {
      return defaultValue;
    }
  }
  saveSingleState(key, value, forceFullySave: boolean = false) {
    if (!persistPageWiseFilter && forceFullySave === false) return;
    sessionStorage.setItem(key, value);
  }
  getSingleState(key, defaultValue, forceFullyGet: boolean = false) {
    if (!persistPageWiseFilter && forceFullyGet === false) return defaultValue;
    const data = sessionStorage.getItem(key);
    if (data) {
      return data;
    } else {
      return defaultValue;
    }
  }
}
