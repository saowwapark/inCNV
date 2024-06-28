import { TabFileMapping } from '../tab-file-mapping.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { TabFileMappingService } from '../tab-file-mapping.service';
import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TabFileMappingFormDialogComponent } from '../tab-file-mapping-form-dialog/tab-file-mapping-form-dialog.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tab-file-mapping-card',
  templateUrl: './tab-file-mapping-card.component.html',
  styleUrls: ['./tab-file-mapping-card.component.scss']
})
export class TabFileMappingCardComponent {
  @Input()
  fileMappingConfigured: TabFileMapping;
  dialogRef;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private _matDialog: MatDialog,
    private _fileMappingService: TabFileMappingService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Edit tabfilemapping
   *
   */
  onEditTabFileMapping(fileMappingConfigured: TabFileMapping): void {
    this.dialogRef = this._matDialog.open(TabFileMappingFormDialogComponent, {
      panelClass: 'dialog-default',
      data: {
        fileMappingConfigured,
        action: 'edit'
      }
    });

    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
      const actionType: string = response[0];
      const formData: FormGroup = response[1];

      switch (actionType) {
        /**
         * Save
         */
        case 'save':
          const updatedTabFileMapping = {
            tabFileMappingId: fileMappingConfigured.tabFileMappingId,
            ...formData.getRawValue()
          };
          this._fileMappingService.updateTabFileMapping(updatedTabFileMapping);

          break;
        /**
         * Delete
         */
        case 'delete':
          this.onDeleteTabFileMapping(fileMappingConfigured);

          break;
      }
    });
  }
  /**
   * Delete TabFileMapping Configured
   */
  onDeleteTabFileMapping(fileMappingConfigured: TabFileMapping): void {
    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      panelClass: 'dialog-warning',
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      `Are you sure you want to delete '${fileMappingConfigured.tabFileMappingName}' ?`;

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._fileMappingService.deleteTabFileMapping(
          fileMappingConfigured.tabFileMappingId
        );
      }
      this.confirmDialogRef = null;
    });
  }
}
