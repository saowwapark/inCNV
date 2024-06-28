import { ReactiveFormsModule } from '@angular/forms';
import { TabFileMappingRoutingModule } from './tab-file-mapping-routing.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { TabFileMappingCardComponent } from './tab-file-mapping-card/tab-file-mapping-card.component';
import { TabFileMappingListComponent } from './tab-file-mapping-list/tab-file-mapping-list.component';
import { TabFileMappingFormDialogComponent } from './tab-file-mapping-form-dialog/tab-file-mapping-form-dialog.component';
import { TabFileMappingComponent } from './tab-file-mapping.component';

@NgModule({
  declarations: [
    TabFileMappingCardComponent,
    TabFileMappingListComponent,
    TabFileMappingFormDialogComponent,
    TabFileMappingComponent
  ],
  imports: [ReactiveFormsModule, SharedModule, TabFileMappingRoutingModule],
  entryComponents: [TabFileMappingFormDialogComponent]
})
export class TabFileMappingModule {}
