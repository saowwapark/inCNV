import { Injectable } from '@angular/core';
import { UploadCnvToolResult } from '../shared/models/upload-cnv-tool-result.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ConstantsService } from 'src/app/services/constants.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class MyFileService {
  baseRouteUrl: string;
  onTriggerDataChanged: BehaviorSubject<void>;
  onSelectedChanged: BehaviorSubject<UploadCnvToolResult[]>;
  onUploadCnvToolResultsChanged: BehaviorSubject<UploadCnvToolResult[]>;
  onSearchTextChanged: Subject<string>;

  constructor(private _http: HttpClient, private _constant: ConstantsService) {
    this.onTriggerDataChanged = new BehaviorSubject(null);
    this.onSelectedChanged = new BehaviorSubject([]);
    this.onUploadCnvToolResultsChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();

    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/upload-cnv-tool-results`;
  }

  getUploadCnvToolResults(): Observable<UploadCnvToolResult[]> {
    return this._http
      .get(`${this.baseRouteUrl}`)
      .pipe(map(res => res['payload']));
  }

  editUploadCnvToolResult(uploadCnvToolResult: UploadCnvToolResult) {
    return this._http.put(
      `${this.baseRouteUrl}/${uploadCnvToolResult.uploadCnvToolResultId}`,
      { uploadCnvToolResult }
    );
  }

  deleteUploadCnvToolResult(uploadCnvToolResultId: number) {
    return this._http.delete(
      `${this.baseRouteUrl}/single-upload-cnv-tool-result/${uploadCnvToolResultId}`
    );
  }

  deleteUploadCnvToolResults(uploadCnvToolResultIds: number[]) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        uploadCnvToolResultIds
      }
    };
    return this._http.delete(
      `${this.baseRouteUrl}/multiple-upload-cnv-tool-result`,
      options
    );
  }
}
