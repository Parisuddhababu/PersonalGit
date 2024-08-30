import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './../_services/authentication.service';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { EncrDecrService } from '../_services/encr-decr.service';
import { CONFIG } from '../config/app-config';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private permissionsService: NgxPermissionsService, private EncrDecr: EncrDecrService, private router: Router) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const decrypted = localStorage.getItem('currentUser');
    const currentUser = this.EncrDecr.get(CONFIG.EncrDecrKey, decrypted);
    if (!currentUser) {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    const currentUserJson = JSON.parse(currentUser);
    const currentUserRole = currentUserJson.user_detail.role || '';

    if (currentUserRole === 'SUPER_ADMIN') {
      this.permissionsService.loadPermissions(['SUPER_ADMIN']);
      return true;
    }

    const currentUserPermissions = currentUserJson.user_detail.permission || [];
    const routePermission = next.data.permission || null;
    if (routePermission == null || currentUserPermissions.indexOf(routePermission) !== -1) {
      this.permissionsService.loadPermissions(currentUserPermissions);
      return true;
    } else {
      this.router.navigate(['/403']);
      return false;
    }
  }

  /*
   * Authentication check for child routes, In case we want to protect only child route.
   */
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
