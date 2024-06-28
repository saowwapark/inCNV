
import { CnvFileDetailTableListComponent } from './cnv-file-detail-table/cnv-file-detail-table-list/cnv-file-detail-table-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CnvFileDetailTableComponent } from './cnv-file-detail-table/cnv-file-detail-table.component';
import { CnvFileDetailService } from './cnv-file-detail.service';
import { CnvFileDetailComponent } from './cnv-file-detail.component';
import { CnvFileDetailDialogComponent } from './cnv-file-detail-dialog/cnv-file-detail-dialog.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CnvFileDetailComponent,
    CnvFileDetailTableComponent,
    CnvFileDetailTableListComponent,
    CnvFileDetailDialogComponent
  ],
  imports: [
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [CnvFileDetailTableComponent],
  providers: [CnvFileDetailService],
  entryComponents: [CnvFileDetailDialogComponent]
})
export class CnvFileDetailModule {}
