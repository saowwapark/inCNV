import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private router: Router) {}

  // I determine if the requested route can be activated (ie, navigated to).
  public canActivate(
    activatedRouteSnapshot: ActivatedRouteSnapshot,
    routerStateSnapshot: RouterStateSnapshot
  ): boolean {
    // We don't want to render this secondary view on page-refresh. As such, if this
    // is a page-refresh, we'll navigate to the same URL less the secondary outlet.
    if (this.isPageRefresh()) {
      console.log('Refresh page.');
      // this.router.navigateByUrl(
      //   this.getUrlWithoutSecondary(routerStateSnapshot)
      // );
      return false;
    }

    return true;
  }
  // I determine if the current route-request is part of a page refresh.
  private isPageRefresh(): boolean {
    // If the router has yet to establish a single navigation, it means that this
    // navigation is the first attempt to reconcile the application state with the
    // URL state. Meaning, this is a page refresh.
    return !this.router.navigated;
  }
}
