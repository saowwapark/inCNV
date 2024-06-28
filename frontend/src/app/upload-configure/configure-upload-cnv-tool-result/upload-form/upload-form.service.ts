import { Injectable } from '@angular/core';
import { IdAndName } from '../../../shared/models/id-and-name.model';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UploadCnvToolResult } from '../../../shared/models/upload-cnv-tool-result.model';
import { ConstantsService } from 'src/app/services/constants.service';

@Injectable()
export class UploadFormService {
  samplesets: IdAndName[];
  tapfileMapping: IdAndName[];
  baseRouteUrl: string;

  constructor(private _http: HttpClient, private _constant: ConstantsService) {
    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/upload-cnv-tool-results`;
  }

  addUploadCnvToolResult(
    uploadCnvToolResult: UploadCnvToolResult,
    file: File
  ): Observable<number> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadCnvToolResult', JSON.stringify(uploadCnvToolResult));

    return this._http
      .post(`${this.baseRouteUrl}`, formData)
      .pipe(map(res => res['payload'])); // return 'let uploadCnvToolResultId: number'
  }

  deleteUploadCnvToolResult(uploadCnvToolResultId: number) {
    return this._http.delete(
      `${this.baseRouteUrl}/single-upload-cnv-tool-result/${uploadCnvToolResultId}`
    );
  }
}
