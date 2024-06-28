import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadConfigureComponent } from './upload-configure.component';
import { UploadFormService } from './configure-upload-cnv-tool-result/upload-form/upload-form.service';

const routes: Routes = [
  {
    path: '',
    component: UploadConfigureComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [UploadFormService]
})
export class UploadConfigureRoutingModule {}
