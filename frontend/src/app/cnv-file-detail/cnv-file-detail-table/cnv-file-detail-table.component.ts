import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CnvFileDetail } from '../cnv-file-detail.model';
import { Subject} from 'rxjs';
import { CnvFileDetailService } from '../cnv-file-detail.service';
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  filter,
  concatMap
} from 'rxjs/operators';

import { DialogAction } from 'src/app/shared/models/dialog.action.model';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { myAnimations } from 'src/app/shared/animations';
import { SearchService } from 'src/app/shared/components/search/search.service';
import { CnvFileDetailDialogComponent } from '../cnv-file-detail-dialog/cnv-file-detail-dialog.component';

@Component({
  selector: 'cnv-file-detail-table',
  templateUrl: './cnv-file-detail-table.component.html',
  styleUrls: ['./cnv-file-detail-table.component.css'],
  animations: myAnimations
})
export class CnvFileDetailTableComponent implements OnInit, OnDestroy {
  @Input() uploadCnvToolResultId: number;

  dialogRef: MatDialogRef<CnvFileDetailDialogComponent>;
  selectedResults: CnvFileDetail[];
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  private _unsubscribeAll: Subject<void>;

  constructor(
    private _reformatService: CnvFileDetailService,
    private _matDialog: MatDialog,
    private _searchService: SearchService
  ) {
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._reformatService.onSelectedChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedResults => {
        this.selectedResults = selectedResults;
      });
    this._searchService.search$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(searchedText => {
        this._reformatService.onSearchTextChanged.next(
          searchedText.trim().toLowerCase()
        );
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * New Sampleset
   */
  onAddData(): void {
    // Original data
    this.dialogRef = this._matDialog.open(CnvFileDetailDialogComponent, {
      panelClass: 'dialog-default',
      data: {
        action: DialogAction.New,
        reformatCnvToolResult: new CnvFileDetail()
      },
      disableClose: true
    });

    // Updated data
    let reformatCnvToolResult: CnvFileDetail;
    this.dialogRef
      .afterClosed()
      .pipe(
        // if false, this means closing dialog by pressing close button.
        filter(response => !!response),
        concatMap((response: CnvFileDetail) => {
          reformatCnvToolResult = {
            ...response,
            uploadCnvToolResultId: this.uploadCnvToolResultId
          }
          return this._reformatService.addReformatCnvToolResult(
            reformatCnvToolResult
          );
        }),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this._reformatService.onTriggerDataChanged.next(
          reformatCnvToolResult.uploadCnvToolResultId
        );
      });
  }
  onDelselectedAll() {
    this._reformatService.onSelectedChanged.next([]);
  }
  onSubmitAllSelected(selectedResults) {
    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      panelClass: 'dialog-warning',
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';

    this.confirmDialogRef
      .afterClosed()
      .pipe(
        filter(response => !!response),
        concatMap(() => {
          const reformatIds = [];
          for (const selectedRow of selectedResults) {
            reformatIds.push(selectedRow.reformatCnvToolResultId);
          }
          return this._reformatService.deleteReformatByReformatIds(reformatIds);
        }),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this._reformatService.onSelectedChanged.next([]);
        this._reformatService.onTriggerDataChanged.next(
          selectedResults[0].uploadCnvToolResultId
        );
        this.confirmDialogRef = null;
      });
  }
}
