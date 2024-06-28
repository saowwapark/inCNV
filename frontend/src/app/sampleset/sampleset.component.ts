import { Sampleset } from './sampleset.model';
import { SamplesetService } from './sampleset.service';
import { myAnimations } from 'src/app/shared/animations';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  filter,
  concatMap
} from 'rxjs/operators';
import {
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { SamplesetFormDialogComponent } from './sampleset-form-dialog/sampleset-form-dialog.component';
import { DialogAction } from '../shared/models/dialog.action.model';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../shared/components/search/search.service';

@Component({
  selector: 'app-sampleset',
  templateUrl: './sampleset.component.html',
  styleUrls: ['./sampleset.component.scss'],
  animations: myAnimations
})
export class SamplesetComponent implements OnInit, OnDestroy {
  dialogRef: MatDialogRef<SamplesetFormDialogComponent>;
  samplesets: Sampleset[];
  selectedSamplesets: Sampleset[];
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  private _unsubscribeAll: Subject<void>;

  constructor(
    public samplesetService: SamplesetService,
    public _matDialog: MatDialog,
    private route: ActivatedRoute,
    private _searchService: SearchService
  ) {
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.samplesets = this.route.snapshot.data['samplesets'];
    const sampleset$ = this.samplesetService.onTriggerDataChanged.pipe(
      switchMap(() => this.samplesetService.getSamplesets())
    );
    sampleset$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(updatedSamplesets => {
        this.samplesets = updatedSamplesets;
      });

    this.samplesetService.onSelectedChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedSamplesets => {
        this.selectedSamplesets = selectedSamplesets;
      });

    this._searchService.search$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(searchText => {
        this.samplesetService.onSearchTextChanged.next(
          searchText.trim().toLowerCase()
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
  onAddSampleset(): void {
    // Original data
    this.dialogRef = this._matDialog.open(SamplesetFormDialogComponent, {
      panelClass: 'dialog-default',
      data: {
        action: DialogAction.New,
        sampleset: new Sampleset()
      },
      disableClose: true
    });

    // Updated data
    this.dialogRef
      .afterClosed()
      .pipe(
        filter(response => !!response),
        concatMap((updatedSampleset: Sampleset) =>
          this.samplesetService.addSampleset(updatedSampleset)
        ),
        tap(() => this.samplesetService.onTriggerDataChanged.next())
      )
      .subscribe();
  }
  onDelselectedAll() {
    this.samplesetService.onSelectedChanged.next([]);
  }
  onSubmitAllSelected(selectedSamplesets: Sampleset[]) {
    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      panelClass: 'dialog-warning',
      disableClose: false
    });
    const ids: number[] = [];
    let rowNames = '';
    selectedSamplesets.forEach((selectedSampleset, index) => {
      ids.push(selectedSampleset.samplesetId);
      if (index === 0) {
        rowNames += selectedSampleset.samplesetName;
      } else {
        rowNames += `, ${selectedSampleset.samplesetName}`;
      }
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      `Are you sure you want to delete '${rowNames}' ?`;

    // after closed dialog
    this.confirmDialogRef
      .afterClosed()
      .pipe(
        filter(response => !!response),
        concatMap(() => this.samplesetService.deleteSamplesets(ids)),
        tap(() => {
          this.samplesetService.onSelectedChanged.next([]);
          this.samplesetService.onTriggerDataChanged.next();
          // clear confirmDialogRef
          this.confirmDialogRef = null;
        })
      )
      .subscribe();
  }
}
