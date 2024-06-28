import { Sampleset } from './sampleset.model';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ConstantsService } from '../services/constants.service';
import { map, tap } from 'rxjs/operators';
import { IdAndName } from '../shared/models/id-and-name.model';

@Injectable()
export class SamplesetService {
  // must remove this line later update file-list.component, choose-file.component, upload-form.service, upload-form.component
  onSamplesetsChanged: BehaviorSubject<Sampleset[]>;
  onSelectedChanged: BehaviorSubject<Sampleset[]>;
  onTriggerDataChanged: BehaviorSubject<void>;
  onSearchTextChanged: Subject<string>;

  baseRouteUrl: string;

  constructor(private _http: HttpClient, private _constant: ConstantsService) {
    console.log('SamplesetService loaded.');
    this.onSelectedChanged = new BehaviorSubject([]);
    this.onSamplesetsChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();
    this.onTriggerDataChanged = new BehaviorSubject(null);
    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/samplesets`;
  }

  /**
   *
   * @param sampleset
   */
  addSampleset(sampleset: Sampleset) {
    console.log('addSampleset');
    const url = `${this.baseRouteUrl}`;
    return this._http.post(url, { ...sampleset });
  }

  editSampleset(sampleset: Sampleset) {
    const samplesetId = sampleset.samplesetId;
    const url = `${this.baseRouteUrl}/${samplesetId}`;
    return this._http.put(url, sampleset);
  }

  deleteSamplesets(samplesetIds: number[]) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        samplesetIds
      }
    };
    return this._http.delete(this.baseRouteUrl, options);
  }
  getIdAndNames(): Observable<IdAndName[]> {
    return this._http
      .get(`${this.baseRouteUrl}/id-names`)
      .pipe(map(res => res['payload']));
  }

  getSamplesets(): Observable<Sampleset[]> {
    return this._http
      .get(`${this.baseRouteUrl}`)
      .pipe(map(res => res['payload']));
  }
}
