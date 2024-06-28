import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { UploadConfigureComponent } from './upload-configure.component';
import { UploadFormComponent } from './configure-upload-cnv-tool-result/upload-form/upload-form.component';
import { PreviewReformatCnvToolResultComponent } from './preview-reformat-cnv-tool-result/preview-reformat-cnv-tool-result.component';
import { UploadConfigureRoutingModule } from './upload-configure-routing.module';
import { CnvFileDetailModule } from '../cnv-file-detail/cnv-file-detail.module';

@NgModule({
  declarations: [
    UploadConfigureComponent,
    UploadFormComponent,
    PreviewReformatCnvToolResultComponent
  ],
  imports: [
    UploadConfigureRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    CnvFileDetailModule
  ],
  entryComponents: []
})
export class UploadConfigureModule {}
