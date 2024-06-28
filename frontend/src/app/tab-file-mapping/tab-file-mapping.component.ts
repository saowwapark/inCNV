import { TabFileMappingService } from './tab-file-mapping.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { TabFileMappingFormDialogComponent } from './tab-file-mapping-form-dialog/tab-file-mapping-form-dialog.component';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SearchService } from '../shared/components/search/search.service';
@Component({
  selector: 'app-tab-file-mapping',
  templateUrl: './tab-file-mapping.component.html',
  styleUrls: ['./tab-file-mapping.component.scss']
})
export class TabFileMappingComponent implements OnInit, OnDestroy {
  dialogRef: any;

  // Private
  private _unsubscribeAll: Subject<void>;

  constructor(
    private _matDialog: MatDialog,
    private _fileMappingService: TabFileMappingService,
    private _searchService: SearchService
  ) {
    this._unsubscribeAll = new Subject();
  }
  ngOnInit(): void {
    this._searchService.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(searchedText => {
        this._fileMappingService.onSearchTextChanged.next(searchedText);
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
   * New upload
   */
  onAddTabFileMapping(): void {
    this.dialogRef = this._matDialog.open(TabFileMappingFormDialogComponent, {
      panelClass: 'dialog-default',
      data: {
        action: 'new'
      }
    });

    this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
      if (!response) {
        return;
      }
      this._fileMappingService.addTabFileMapping(response.getRawValue());
    });
  }
}
