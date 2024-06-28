import { MatPaginator } from '@angular/material/paginator';
import {
  Component,
  OnDestroy,
  ViewChild,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { UploadCnvToolResult } from 'src/app/shared/models/upload-cnv-tool-result.model';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { myAnimations } from 'src/app/shared/animations';
import { AnalysisConfigureService } from '../analysis-configure.service';

@Component({
  selector: 'app-choose-many-file',
  templateUrl: './choose-many-file.component.html',
  styleUrls: ['./choose-many-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: myAnimations
})
export class ChooseManyFileComponent implements OnChanges, OnDestroy {
  @Input() samplesetId: number;
  @Input() sample: string;
  @Input() referenceGenome: string;
  @Input() selectedFiles: UploadCnvToolResult[];
  @Output() selectedFilesChange = new EventEmitter<UploadCnvToolResult[]>();
  @ViewChild(MatSort, { static: true }) matSort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns = [
    'select',
    'fileName',
    'fileInfo',
    'cnvToolName',
    'tagDescriptions',
    'createdDate'
  ];

  dataSource: MatTableDataSource<UploadCnvToolResult> = new MatTableDataSource(
    []
  );
  selection = new SelectionModel<UploadCnvToolResult>(true, []);
  isLoadingResults = true;

  // Private
  private _unsubscribeAll: Subject<void>;

  /**
   *
   * constructor
   */
  constructor(
    private detectorRef: ChangeDetectorRef,
    private _service: AnalysisConfigureService
  ) {
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, propName)) {
        switch (propName) {
          case 'referenceGenome':
            this.updateDatasource();
            this.selection.deselect(...this.selectedFiles);
            this.selectedFiles = [];
            break;
          case 'samplesetId':
            this.updateDatasource();
            this.selection.deselect(...this.selectedFiles);
            this.selectedFiles = [];
            break;
          case 'sample':
            this.selection.deselect(...this.selectedFiles);
            this.selectedFiles = [];
            break;
          case 'selectedFiles':
            this.selection.select(...this.selectedFiles);
            break;
        }
      }
    }
  }

  updateDatasource() {
    this._service
      .getUploadCnvToolResults(this.referenceGenome, this.samplesetId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(uploadCnvToolResults => {
        this.dataSource = new MatTableDataSource(uploadCnvToolResults);
        this.dataSource.sort = this.matSort;
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

    this.selectedFiles = this.selection.selected;
    this.selectedFilesChange.emit(this.selectedFiles);
  }

  toggleRow(upload: UploadCnvToolResult) {
    this.selection.toggle(upload);
    this.selectedFiles = this.selection.selected;
    this.selectedFilesChange.emit(this.selectedFiles);
  }
}
