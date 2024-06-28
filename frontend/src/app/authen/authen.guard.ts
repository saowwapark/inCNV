import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import { AuthenService } from './authen.service';

@Injectable()
export class AuthenGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthenService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthen$.pipe(
      take(1),
      tap((isAuthen: boolean) => {
        if (!isAuthen) {
          this.router.navigate(['signin']);
        }
      })
    );
  }
  canActivateChild():  Observable<boolean> {
    return this.canActivate();
  }
}
