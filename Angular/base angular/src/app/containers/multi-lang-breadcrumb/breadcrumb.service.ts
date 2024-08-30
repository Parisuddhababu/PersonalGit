import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isEmpty } from './../../utils/common';
@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private isEmpty = isEmpty;
  breadcrumbs: Observable<Array<any>>;

  private breadcrumbSubject: BehaviorSubject<Array<any>>;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.breadcrumbSubject = new BehaviorSubject<any[]>(new Array<any>());

    this.breadcrumbs = this.breadcrumbSubject.asObservable();

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      const breadcrumbs = [];
      let currentRoute = this.route.root;
      let url = '';
      do {
        const childrenRoutes = currentRoute.children;
        currentRoute = null;
        childrenRoutes.forEach((routeObj) => {
          if (routeObj.outlet === 'primary') {
            const routeSnapshot = routeObj.snapshot;
            url += '/' + routeSnapshot.url.map((segment) => segment.path).join('/');
            if (!_.endsWith(url, '/') && routeSnapshot.children.length > 0 && !isEmpty(routeSnapshot.params)) {
              url += '/';
            }
            breadcrumbs.push({
              label: routeObj.snapshot.data,
              url,
            });
            currentRoute = routeObj;
          }
        });
      } while (currentRoute);
      this.breadcrumbSubject.next(Object.assign([], breadcrumbs));

      return breadcrumbs;
    });
  }
}
