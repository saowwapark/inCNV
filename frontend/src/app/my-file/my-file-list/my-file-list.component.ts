import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { filter, mergeMap, takeUntil, tap } from 'rxjs/operators';

import { Subject } from 'rxjs';
import { UploadCnvToolResult } from '../../shared/models/upload-cnv-tool-result.model';
import { MatSort } from '@angular/material/sort';
import { MyFileService } from '../my-file.service';
import { DialogAction } from 'src/app/shared/models/dialog.action.model';
import { UploadDialogComponent } from '../upload-dialog/upload-dialog.component';
import { IdAndName } from 'src/app/shared/models/id-and-name.model';
import { SamplesetService } from 'src/app/sampleset/sampleset.service';
import { TabFileMappingService } from 'src/app/tab-file-mapping/tab-file-mapping.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'my-file-list',
  templateUrl: './my-file-list.component.html',
  styleUrls: ['./my-file-list.component.scss']
})
export class MyFileListComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  uploads: any;
  displayedColumns = [
    'select',
    'no',
    'fileName',
    'fileInfo',
    'referenceGenome',
    'cnvToolName',
    'tabFileMappingName',
    'samplesetName',
    'tagDescriptions',
    'createDate',
    'detail',
    'edit'
  ];

  dialogRef: any;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  dataSource: MatTableDataSource<UploadCnvToolResult> = new MatTableDataSource(
    []
  );
  selection = new SelectionModel<UploadCnvToolResult>(true, []);
  samplesets: IdAndName[];
  tabFileMappings: IdAndName[];

  // Private
  private _unsubscribeAll: Subject<void>;

  constructor(
    private _service: MyFileService,
    public _matDialog: MatDialog,
    private _samplesetService: SamplesetService,
    private _tabFileMappingService: TabFileMappingService
  ) {
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._service.onSelectedChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(rows => {
        if (!rows || rows.length < 1) {
          this.selection.clear();
        }
      });
    this._service.onSearchTextChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((filterValue: string) => {
        this.dataSource.filter = filterValue.trim().toLowerCase();
      });
    this._samplesetService
      .getIdAndNames()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(samplesets => {
        this.samplesets = samplesets;
      });

    this._tabFileMappingService
      .getIdAndNames()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(tabFileMappings => {
        this.tabFileMappings = tabFileMappings;
      });
  }

  ngAfterViewInit() {
    this._service.onTriggerDataChanged
      .pipe(
        mergeMap(() => this._service.getUploadCnvToolResults()),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(uploadCnvToolResults => {
        this.dataSource = new MatTableDataSource(uploadCnvToolResults);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
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
  // @ Methods
  // -----------------------------------------------------------------------------------------------------

  onEditData(uploadCnvToolResult: UploadCnvToolResult): void {
    this._service.onSelectedChanged.next([]);
    // Original data
    this.dialogRef = this._matDialog.open(UploadDialogComponent, {
      panelClass: 'dialog-default',
      data: {
        action: DialogAction.Edit,
        tabFileMappings: this.tabFileMappings,
        samplesets: this.samplesets,
        uploadCnvToolResult
      }
    });

    // Updated data
    this.dialogRef
      .afterClosed()
      .pipe(
        filter(response => !!response),
        tap((updatedData: UploadCnvToolResult) =>
          this._service.editUploadCnvToolResult(updatedData)
        )
      )
      .subscribe(() => {
        this._service.onTriggerDataChanged.next();
      });
  }
  /************************* Select **************************/
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(sampleset =>
        this.selection.select(sampleset)
      );
    }

    this._service.onSelectedChanged.next(this.selection.selected);
  }

  toggleRow(upload: UploadCnvToolResult) {
    this.selection.toggle(upload);
    this._service.onSelectedChanged.next(this.selection.selected);
  }
}
