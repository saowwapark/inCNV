import { ConstantsService } from '../services/constants.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, concat } from 'rxjs';

import { AuthenReq, AuthenRes } from './authen.model';
import { map, tap } from 'rxjs/operators';
import { EMAIL, EXPIRATION, INDIVIDUAL_CONFIG, MULTIPLE_CONFIG, TOKEN } from 'src/constants/local-storage.const';

@Injectable()
export class AuthenService {
  private baseRouteUrl: string;
  private token: string;
  private tokenTimer: any;
  private isAuthenSubject = new BehaviorSubject<boolean>(false);
  isAuthen$ = this.isAuthenSubject.asObservable();

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _constant: ConstantsService
  ) {
    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/users`;
  }

  getToken() {
    return this.token;
  }

  addUser(email: string, password: string) {
    const authData: AuthenReq = { email, password };
    return this._http.post(`${this.baseRouteUrl}/signup`, authData);
  }

  signUp(email: string, password: string) {
    return concat(this.addUser(email, password), this.login(email, password));
  }

  createAuthData(token: string, expiresInDuration: number) {
    if (token && expiresInDuration) {
      this.setAuthTimer(expiresInDuration);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      return { token, expirationDate };
    }
  }

  login(email: string, password: string) {
    const authReq: AuthenReq = { email, password };
    return this._http.post<any>(`${this.baseRouteUrl}/login`, authReq).pipe(
      map(res => res['payload']),
      tap((authenRes: AuthenRes) => {
        const authData = this.createAuthData(authenRes.token, authenRes.expiresIn);
        this.saveAuthData(email, authData.token, authData.expirationDate);
        this.token = authData.token;
        this.isAuthenSubject.next(true);
      })
    );
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.setAuthTimer(expiresIn / 1000);
      this.isAuthenSubject.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenSubject.next(false);
    clearTimeout(this.tokenTimer);
    this.clearLocalStorage();
    this._router.navigate(['']);
  }
  /**
   * Set authentication timer and logout when token expires
   *
   * @param duration - second unit (not millisecond)
   */
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(email: string, token: string, expirationDate: Date) {
    localStorage.setItem(EMAIL, email);
    localStorage.setItem(TOKEN, token);
    localStorage.setItem(EXPIRATION, expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem(EMAIL);
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(EXPIRATION);
  }
  private clearAnalysisConfig() {
    localStorage.removeItem(INDIVIDUAL_CONFIG);
    localStorage.removeItem(MULTIPLE_CONFIG);
  }

  private clearLocalStorage() {
    this.clearAuthData();
    this.clearAnalysisConfig();
  }

  private getAuthData() {
    const token = localStorage.getItem(TOKEN);
    const expirationDate = localStorage.getItem(EXPIRATION);
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate)
    };
  }
}
