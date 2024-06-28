import { UploadCnvToolResult } from 'src/app/shared/models/upload-cnv-tool-result.model';
import { MyFileService } from './my-file.service';
import {
  Component,
  OnInit,
} from '@angular/core';
import { Subject, NEVER } from 'rxjs';
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  concatMap
} from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { myAnimations } from 'src/app/shared/animations';
import { SearchService } from 'src/app/shared/components/search/search.service';

@Component({
  selector: 'my-file',
  templateUrl: './my-file.component.html',
  styleUrls: ['./my-file.component.scss'],
  animations: myAnimations
})
export class MyFileComponent implements OnInit {
  selectedUploads: any[] = [];
  hasSelectedRows = false;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  private _unsubscribeAll: Subject<void>;

  constructor(
    private searchService: SearchService,
    public myFileService: MyFileService,
    public matDialog: MatDialog
  ) {
    this._unsubscribeAll = new Subject();
  }

  onSubmitAllSelected(selectedUploads: UploadCnvToolResult[]) {
    this.confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
      panelClass: 'dialog-warning',
      disableClose: false
    });

    let rowNames = '';
    const ids: number[] = [];
    selectedUploads.forEach((selectedUpload, index) => {
      ids.push(selectedUpload.uploadCnvToolResultId);
      if (index === 0) {
        rowNames += selectedUpload.fileName;
      } else {
        rowNames += `, ${selectedUpload.fileName}`;
      }
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      `Are you sure you want to delete '${rowNames}'? `;

    this.confirmDialogRef
      .afterClosed()
      .pipe(
        concatMap(result => {
          if (!result) {
            return NEVER;
          } else {
            return this.myFileService.deleteUploadCnvToolResults(ids);
          }
        }),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this.myFileService.onSelectedChanged.next([]);
        this.myFileService.onTriggerDataChanged.next();
        this.confirmDialogRef = null;
      });
  }

  onDelselectedAll() {
    this.myFileService.onSelectedChanged.next([]);
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.myFileService.onSelectedChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedRows => {
        this.selectedUploads = selectedRows;
      });

    this.searchService.search$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(searchedText => {
        this.myFileService.onSearchTextChanged.next(
          searchedText.trim().toLowerCase()
        );
      });
  }
}
