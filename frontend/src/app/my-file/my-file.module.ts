import { MyFileRoutingModule } from './my-file-routing.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { MyFileComponent } from './my-file.component';
// eslint-disable-next-line max-len
import { MyFileListComponent } from './my-file-list/my-file-list.component';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';
import { UploadDialogService } from './upload-dialog/upload-dialog.service';
import { UploadConfigureService } from '../upload-configure/upload-configure.service';
import { MyFileService } from './my-file.service';
import { UploadFormService } from '../upload-configure/configure-upload-cnv-tool-result/upload-form/upload-form.service';
import { ConfigureCnvToolFilesService } from '../services/configure-cnv-tool-files.service';
import { CnvFileDetailModule } from '../cnv-file-detail/cnv-file-detail.module';

@NgModule({
  declarations: [
    MyFileComponent,
    MyFileListComponent,
    UploadDialogComponent,
  ],
  imports: [
    SharedModule,
    CnvFileDetailModule,
    MyFileRoutingModule,
  ],
  providers: [
    UploadDialogService,
    UploadConfigureService,
    MyFileService,
    UploadFormService,
    ConfigureCnvToolFilesService,

  ],
  entryComponents: [UploadDialogComponent]
})
export class MyFileModule {}
