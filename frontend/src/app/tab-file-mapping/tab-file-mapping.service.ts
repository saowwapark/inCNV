import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchUtils } from '../utils/search.utils';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { TabFileMapping } from './tab-file-mapping.model';
import { ConstantsService } from 'src/app/services/constants.service';
import { map } from 'rxjs/operators';
import { IdAndName } from 'src/app/shared/models/id-and-name.model';

@Injectable()
export class TabFileMappingService implements Resolve<any> {
  fileMappingConfigureds: TabFileMapping[];
  searchText: string;
  onTriggerDataChanged: BehaviorSubject<void>;
  onTabFileMappingsChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  baseRouteUrl: string;

  constructor(private _http: HttpClient, private _constant: ConstantsService) {
    console.log('TabFileMappingService loaded.');
    this.onTriggerDataChanged = new BehaviorSubject(null);
    this.onTabFileMappingsChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();
    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/tab-file-mappings`;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Resolver
   *
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getTabFileMapping()]).then(() => {
        this.onSearchTextChanged.subscribe(searchText => {
          this.searchText = searchText;
          this.getTabFileMapping();
        });
        resolve(null);
      }, reject);
    });
  }

  /**
   * Add tabFileMapping configured
   *
   */
  addTabFileMapping(fileMappingConfigured: TabFileMapping): Promise<any> {
    return new Promise((resolve, reject) => {
      this._http
        .post(`${this.baseRouteUrl}`, {
          ...fileMappingConfigured
        })
        .subscribe(response => {
          this.onTriggerDataChanged.next();
          this.getTabFileMapping();
          resolve(response);
        });
    });
  }

  /**
   * Update tabFileMapping configured
   *
   */
  updateTabFileMapping(fileMappingConfigured: TabFileMapping): Promise<any> {
    return new Promise((resolve, reject) => {
      this._http
        .put(`${this.baseRouteUrl}/${fileMappingConfigured.tabFileMappingId}`, {
          ...fileMappingConfigured
        })
        .subscribe(response => {
          this.onTriggerDataChanged.next();
          this.getTabFileMapping();
          resolve(response);
        });
    });
  }

  /**
   * Delete TabFileMapping Configured
   *
   */
  deleteTabFileMapping(tabFileMappingId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._http
        .delete(`${this.baseRouteUrl}/${tabFileMappingId}`)
        .subscribe(response => {
          this.onTriggerDataChanged.next();
          this.getTabFileMapping();
          resolve(response);
        });
    });
  }
  getTabFileMapping(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._http.get(`${this.baseRouteUrl}`).subscribe((response: any) => {
        this.fileMappingConfigureds = response['payload'];
        if (this.searchText && this.searchText !== '') {
          this.fileMappingConfigureds = SearchUtils.filterArrayByString(
            this.fileMappingConfigureds,
            this.searchText
          );
        }
        this.onTabFileMappingsChanged.next(this.fileMappingConfigureds);
        resolve(this.fileMappingConfigureds);
      }, reject);
    });
  }

  getIdAndNames(): Observable<IdAndName[]> {
    return this._http
      .get(`${this.baseRouteUrl}/id-names`)
      .pipe(map(res => res['payload']));
  }
}
