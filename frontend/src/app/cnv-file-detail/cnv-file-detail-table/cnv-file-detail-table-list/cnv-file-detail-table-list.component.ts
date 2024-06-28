import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  AfterViewInit,
  ViewEncapsulation
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, merge, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { CnvFileDetail } from '../../cnv-file-detail.model';
import {
  takeUntil,
  startWith,
  switchMap,
  map,
  catchError,
  filter
} from 'rxjs/operators';
import { CnvFileDetailService } from '../../cnv-file-detail.service';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogAction } from 'src/app/shared/models/dialog.action.model';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CnvFileDetailDialogComponent } from '../../cnv-file-detail-dialog/cnv-file-detail-dialog.component';

@Component({
  selector: 'cnv-file-detail-table-list',
  templateUrl: './cnv-file-detail-table-list.component.html',
  styleUrls: ['./cnv-file-detail-table-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CnvFileDetailTableListComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() uploadCnvToolResultId: number;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dialogRef: MatDialogRef<CnvFileDetailDialogComponent>;
  selection = new SelectionModel<CnvFileDetail>(true, []);
  displayedColumns = [
    'select',
    'no',
    'sample',
    'chromosome',
    'startBp',
    'endBp',
    'cnvType',
    'edit'
  ];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  dataSource: MatTableDataSource<CnvFileDetail>;
  private _unsubscribeAll: Subject<void>;

  constructor(
    private _reformatService: CnvFileDetailService,
    public _matDialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource();

    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this._reformatService.onSelectedChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedResult => {
        if (!selectedResult || selectedResult.length < 1) {
          this.selection.clear();
        }
      });

    this._reformatService.onSearchTextChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((filterValue: string) => {
        this.dataSource.filter = filterValue.trim().toLowerCase();
      });

    this._reformatService.onTriggerDataChanged
      .pipe(
        switchMap(uploadCnvToolResultId =>
          this._reformatService.getReformatCnvToolResults(
            uploadCnvToolResultId,
            'sort',
            'order',
            this.paginator.pageIndex,
            this.paginator.pageSize
          )
        ),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(response => {
        this.dataSource.data = response.items;
        this.resultsLength = response.totalCount;
      });
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this._reformatService.getReformatCnvToolResults(
            this.uploadCnvToolResultId,
            'sort',
            'order',
            this.paginator.pageIndex,
            this.paginator.pageSize
          );
        }),
        map((data: { items: CnvFileDetail[]; totalCount: number }) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.totalCount;

          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return of([]);
        })
      )
      .subscribe(
        (data: CnvFileDetail[]) => (this.dataSource.data = data)
      );
  }
  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  onEditData(reformatCnvToolResult: CnvFileDetail): void {
    this._reformatService.onSelectedChanged.next([]);
    // Original data
    this.dialogRef = this._matDialog.open(CnvFileDetailDialogComponent, {
      panelClass: 'dialog-default',
      data: {
        reformatCnvToolResult,
        action: DialogAction.Edit
      }
    });

    // Updated data
    this.dialogRef
      .afterClosed()
      .pipe(
        filter(response => !!response),
        switchMap((updatedData: CnvFileDetail) =>
          this._reformatService.editReformatCnvToolResult(updatedData)
        ),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this._reformatService.onTriggerDataChanged.next(
          reformatCnvToolResult.uploadCnvToolResultId
        );
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
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
    this._reformatService.onSelectedChanged.next(this.selection.selected);
  }

  toggleSelect(reformatCnvToolResult: CnvFileDetail) {
    this.selection.toggle(reformatCnvToolResult);
    this._reformatService.onSelectedChanged.next(this.selection.selected);
  }
}
