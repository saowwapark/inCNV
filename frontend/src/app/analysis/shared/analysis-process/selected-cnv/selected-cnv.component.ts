import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AnnotationDialogComponent } from '../annotation-dialog/annotation-dialog.component';
import { AnalysisProcessService } from '../analysis-process.service';
import {
  CnvInfo,
  CnvInfoView,
  MULTIPLE_SAMPLE_ANALYSIS
} from 'src/app/analysis/analysis.model';
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';
import { SelectedCnvDialogComponent } from './selected-cnv-dialog/selected-cnv-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-selected-cnv',
  templateUrl: './selected-cnv.component.html',
  styleUrls: ['./selected-cnv.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class SelectedCnvComponent implements OnInit, OnDestroy {
  @Input() analysisType: string;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  selectedCnvs: CnvInfoView[];
  displayedColumns = [
    'no',
    'chromosome',
    'startBp',
    'endBp',
    'cnvType',
    'overlapLength',
    'cnvTools',
    'delete'
  ];
  dialogRef: MatDialogRef<AnnotationDialogComponent>;
  expandedElement: string | null;

  dataSource = new MatTableDataSource<CnvInfoView>();
  cnvInfoViews: CnvInfoView[] = [];
  shownTableData: CnvInfoView[] = [];

  private _unsubscribeAll: Subject<void>;

  constructor(
    public _matDialog: MatDialog,
    private detectorRef: ChangeDetectorRef,
    private service: AnalysisProcessService
  ) {
    // this.detectorRef.detach();
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    if (this.analysisType === MULTIPLE_SAMPLE_ANALYSIS) {
      this.displayedColumns = [
        'no',
        'chromosome',
        'startBp',
        'endBp',
        'cnvType',
        'overlapLength',
        'samples',
        'delete'
      ];
    }
    this.service.onSelectedCnvChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cnvInfos: CnvInfoView[]) => {
        this.selectedCnvs = cnvInfos;
        this.updateTableData();
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
  // ################################################ Table ################################################
  ensemblLink(geneId: string) {
    const url = `http://www.ensembl.org/id/${geneId}`;
    window.open(url, '_blank');
  }
  dgvLink(referenceGenome: string, variantAccession: string) {
    if (referenceGenome === 'grch37') {
      const url = `http://dgv.tcag.ca/gb2/gbrowse/dgv2_hg19/?name=${variantAccession}`;
      window.open(url, '_blank');
    } else if (referenceGenome === 'grch38') {
      const url = `http://dgv.tcag.ca/gb2/gbrowse/dgv2_hg38/?name=${variantAccession}`;
      window.open(url, '_blank');
    }
  }
  clinvarLink(omimId: string) {
    const url = `https://omim.org/search/?search=${omimId}`;
    window.open(url, '_blank');
  }

  trackByFn(index: number, item: CnvInfo) {
    if (!item) {
      return null;
    } else {
      return [item.startBp, item.endBp];
    }
  }

  /************************* Sort Row **************************/
  sortFunc(array: Object[], propName: string, direction: 'asc' | 'desc' | '') {
    if (direction === 'asc') array.sort((a, b) => a[propName] - b[propName]);
    else if (direction === 'desc') array.sort((a, b) => b[propName] - a[propName]);
  }

  onHandleSort(event: Sort) {
    const column = event.active;
    const direction = event.direction;
    this.sortFunc(this.cnvInfoViews, column, direction);
    this.updateTableData();
  }

  onSearchAll() {
    this.updateTableData();
  }

  updateTableData() {
    this.paginator.length = this.selectedCnvs.length;
    this.shownTableData = this.slicePageData(this.selectedCnvs);
    this.dataSource.data = this.shownTableData;
  }


  slicePageData(datas: CnvInfoView[]) {
    const pageIndex = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    return datas.slice(startIndex, endIndex);
  }

  exportCnvInfos() {
    this.service.downloadCnvInfos(this.selectedCnvs).subscribe(() => {
      console.log('export success');
    });
  }

  deleteRow(index: number) {
    this.selectedCnvs.splice(index, 1);
    this.service.onSelectedCnvChanged.next(this.selectedCnvs);
    // this.detectorRef.markForCheck();
  }
}
