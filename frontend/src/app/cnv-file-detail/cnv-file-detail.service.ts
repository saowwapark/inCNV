import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from 'src/app/services/constants.service';
import { map } from 'rxjs/operators';
import { CnvFileDetail } from './cnv-file-detail.model';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class CnvFileDetailService {
  onResultsChanged: BehaviorSubject<CnvFileDetail[]>;
  onSelectedChanged: BehaviorSubject<CnvFileDetail[]>;
  onTriggerDataChanged: Subject<number>;
  onSearchTextChanged: Subject<string>;

  baseRouteUrl: string;

  constructor(private _http: HttpClient, private _constant: ConstantsService) {
    this.onSelectedChanged = new BehaviorSubject([]);
    this.onResultsChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();
    this.onTriggerDataChanged = new Subject();
    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/reformat-cnv-tool-results`;
  }

  getReformatCnvToolResults(
    uploadCnvToolResultId: number,
    sort?: string,
    order?: string,
    pageNumber?: number,
    pageSize?: number
  ): Observable<{ items: CnvFileDetail[]; totalCount: number }> {
    return this._http
      .get(
        `${this.baseRouteUrl}/upload-cnv-tool-results/${uploadCnvToolResultId}`,
        {
          params: {
            sort,
            order,
            pageNumber: String(pageNumber + 1),
            pageSize: String(pageSize)
          }
        }
      )

      .pipe(map(res => res['payload']));
  }

  deleteReformatByUploadId(uploadCnvToolResultId: number) {
    return this._http.delete(
      `${this.baseRouteUrl}/single-upload-cnv-tool-result`,
      {
        params: { uploadCnvToolResultId: String(uploadCnvToolResultId) }
      }
    );
  }

  /** Records */
  deleteReformatByReformatIds(reformatCnvToolResultIds: number[]) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        reformatCnvToolResultIds
      }
    };
    return this._http.delete(
      `${this.baseRouteUrl}/multiple-upload-cnv-tool-result`,
      options
    );
  }
  editReformatCnvToolResult(reformatCnvToolResult: CnvFileDetail) {
    return this._http.put(
      `${this.baseRouteUrl}/${reformatCnvToolResult.reformatCnvToolResultId}`,
      { reformatCnvToolResult }
    );
  }
  addReformatCnvToolResult(reformatCnvToolResult: CnvFileDetail) {
    return this._http.post(
      `${this.baseRouteUrl}`,
      { reformatCnvToolResult }
    );
  }
}
