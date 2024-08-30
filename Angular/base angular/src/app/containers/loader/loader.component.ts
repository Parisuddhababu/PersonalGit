import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `<ngx-ui-loader [fgsColor]="config.fgsColor" [pbColor]="config.pbColor"></ngx-ui-loader>`,
})
export class LoaderComponent implements OnInit {
  // theme color : #bb3f42;
  config: any = {
    fgsColor: '#bb3f42',
    pbColor: '#bb3f42',
    bgsOpacity: 1,

    // "bgsColor": "#00ACC1",
    // "bgsPosition": "bottom-right",
    // "bgsSize": 60,
    // "bgsType": "ball-spin-clockwise",
    // "blur": 5,
    // "fgsPosition": "center-center",
    // "fgsSize": 60,
    // "fgsType": "ball-spin-clockwise",
    // "gap": 24,
    // "logoPosition": "center-center",
    // "logoSize": 120,
    // "logoUrl": "",
    // "masterLoaderId": "master",
    // "overlayBorderRadius": "0",
    // "overlayColor": "rgba(40, 40, 40, 0.8)",
    // "pbDirection": "ltr",
    // "pbThickness": 3,
    // "hasProgressBar": true,
    // "text": "",
    // "textColor": "#FFFFFF",
    // "textPosition": "center-center",
    // "threshold": 500
  };
  constructor() {}
  ngOnInit() {}
}
