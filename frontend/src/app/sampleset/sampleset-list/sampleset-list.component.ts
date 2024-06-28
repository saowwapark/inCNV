import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  OnChanges
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';

import { DialogAction } from '../../shared/models/dialog.action.model';
import { SamplesetService } from 'src/app/sampleset/sampleset.service';
import { MatTableDataSource } from '@angular/material/table';
import { Sampleset } from '../sampleset.model';
import { SamplesetFormDialogComponent } from '../sampleset-form-dialog/sampleset-form-dialog.component';

@Component({
  selector: 'app-sampleset-list',
  templateUrl: './sampleset-list.component.html',
  styleUrls: ['./sampleset-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class SamplesetListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() samplesets: Sampleset[];
  @ViewChild(MatSort, { static: true }) matSort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSource: MatTableDataSource<Sampleset>;
  displayedColumns = [
    'select',
    'samplesetName',
    'description',
    'createDate',
    'lastUpdated',
    'edit'
  ];

  selection = new SelectionModel<Sampleset>(true, []);

  dialogRef: MatDialogRef<SamplesetFormDialogComponent>;

  expandedElement: string | null;

  private _unsubscribeAll: Subject<void>;

  constructor(
    private _samplesetService: SamplesetService,
    public _matDialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource();
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.dataSource.sort = this.matSort;
    this.dataSource.paginator = this.paginator;

    this._samplesetService.onSelectedChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedSamplesets => {
        if (!selectedSamplesets || selectedSamplesets.length < 1) {
          this.selection.clear();
        }
      });

    this._samplesetService.onSearchTextChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((filterValue: string) => {
        this.dataSource.filter = filterValue.trim().toLowerCase();
      });
  }

  ngOnChanges() {
    this.dataSource.data = this.samplesets;
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

  onEditSampleset(sampleset: Sampleset): void {
    this._samplesetService.onSelectedChanged.next([]);
    // Original data
    this.dialogRef = this._matDialog.open(SamplesetFormDialogComponent, {
      panelClass: 'dialog-default',
      data: {
        sampleset,
        action: DialogAction.Edit
      }
    });

    // Updated data
    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
      const updatedSampleset: Sampleset = response;

      this._samplesetService.editSampleset(updatedSampleset).subscribe(() => {
        this._samplesetService.onTriggerDataChanged.next();
      });
    });
  }

  // /************************* Collapse ************************/
  // onSampleset(element) {
  //   if (this.expandedElement === element) {
  //     this.expandedElement = null;
  //   } else {
  //     this.expandedElement = element;
  //   }
  // }

  /************************* Select **************************/
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
    this._samplesetService.onSelectedChanged.next(this.selection.selected);
  }

  toggleSampleset(sampleset: Sampleset) {
    this.selection.toggle(sampleset);
    this._samplesetService.onSelectedChanged.next(this.selection.selected);
  }
}
