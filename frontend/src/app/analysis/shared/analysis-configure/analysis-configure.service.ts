import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConstantsService } from 'src/app/services/constants.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UploadCnvToolResult } from 'src/app/shared/models/upload-cnv-tool-result.model';

@Injectable()
export class AnalysisConfigureService {
  baseRouteUrl: string;

  constructor(private _http: HttpClient, private _constant: ConstantsService) {
    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/analysises`;
  }

  getUploadCnvToolResults(
    referenceGenome,
    samplesetId
  ): Observable<UploadCnvToolResult[]> {
    return this._http
      .get(`${this.baseRouteUrl}/upload-cnv-tool-results`, {
        params: {
          referenceGenome,
          samplesetId
        }
      })
      .pipe(map(res => res['payload']));
  }
}
