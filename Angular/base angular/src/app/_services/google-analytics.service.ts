import { Injectable } from '@angular/core';
import { GOOGLE_ANALYTICS_ID } from '../config/app-config';
import { ENABLE_GOOGLE_ANALYTICS } from './../config/app-config';
import { isEmpty } from './../utils/common';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {

  constructor() { }

  static loadGoogleAnalytics(): void {
    if (!ENABLE_GOOGLE_ANALYTICS || (ENABLE_GOOGLE_ANALYTICS && isEmpty(GOOGLE_ANALYTICS_ID))) return;
    const gaScript1 = document.createElement('script');
    gaScript1.innerText = `window.dataLayer = window.dataLayer || [];function gtag() { dataLayer.push(arguments); }gtag('js', new Date());gtag('config', '${GOOGLE_ANALYTICS_ID}');`;

    const gaScript = document.createElement('script');
    gaScript.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`);

    document.documentElement.firstChild.appendChild(gaScript);
    document.documentElement.firstChild.appendChild(gaScript1);
  }

  static visitPage() {
    if (!ENABLE_GOOGLE_ANALYTICS || (ENABLE_GOOGLE_ANALYTICS && isEmpty(GOOGLE_ANALYTICS_ID))) return;
    gtag('event', 'page_view');
  }
}
