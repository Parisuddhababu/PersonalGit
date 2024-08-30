import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private subject = new Subject<any>();

  languages: any[] = [];

  cookieService: CookieService;
  constructor() {}

  changeLanguage(lan: string) {
    localStorage.setItem('lan', lan);
    this.subject.next(lan);
  }

  getLanguage(): Observable<any> {
    return this.subject.asObservable();
  }

  DefaultLanguage() {
    const CurrentLanguage = localStorage.getItem('lan');
    const IsExist = false;
    return IsExist ? 'en' : CurrentLanguage || 'en';
  }
}
