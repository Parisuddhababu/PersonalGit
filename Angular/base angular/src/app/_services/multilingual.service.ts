import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MultilingualService {
  constructor() {}
  saveLanguage(value) {
    localStorage.setItem('languages', JSON.stringify(value));
  }
  getLanguage() {
    const data = localStorage.getItem('languages');
    if (data) {
      return JSON.parse(data);
    } else {
      return [];
    }
  }
}
