import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { UploadFormService } from './configure-upload-cnv-tool-result/upload-form/upload-form.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'upload-configure',
  templateUrl: './upload-configure.component.html',
  styleUrls: ['./upload-configure.component.scss']
})
export class UploadConfigureComponent {
  uploadCnvToolResultId: number;
  constructor(
    private _uploadFormService: UploadFormService
  ) {}

  @ViewChild('stepper', { static: true }) private stepper: MatStepper;

  goToReformatStep(uploadCnvToolResultId) {
    this.uploadCnvToolResultId = uploadCnvToolResultId;
    this.stepper.next();
  }

  goToUploadStep() {
    this.deleteConfigure().subscribe(() => {
      this.stepper.previous();
    });
  }

  goToSuccessStep() {
    this.stepper.next();
  }

  deleteConfigure(): Observable<any> {
    const deleteUpload$ = this._uploadFormService.deleteUploadCnvToolResult(
      this.uploadCnvToolResultId
    );
    return deleteUpload$;
  }

  uploadAgain() {
    this.uploadCnvToolResultId = undefined;
    this.stepper.reset();
  }
}
