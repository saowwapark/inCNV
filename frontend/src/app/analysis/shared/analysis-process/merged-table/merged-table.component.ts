import {
  DgvAnnotation,
  MULTIPLE_SAMPLE_ANALYSIS,
  CnvInfoView,
  CnvGroup
} from './../../../analysis.model';
// onpush
import { AnalysisProcessService } from './../analysis-process.service';

import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  OnChanges,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { CnvInfo } from 'src/app/analysis/analysis.model';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';

import { AnnotationDialogComponent } from '../annotation-dialog/annotation-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-merged-table',
  templateUrl: './merged-table.component.html',
  styleUrls: ['./merged-table.component.scss'],
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
export class MergedTableComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() analysisType: string;
  @Input() mergedData: CnvGroup;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  displayedColumns = [
    'select',
    'no',
    'chromosome',
    'startBp',
    'endBp',
    'cnvType',
    'overlapLength',
    'cnvTools'
  ];
  dialogRef: MatDialogRef<AnnotationDialogComponent>;
  expandedElement: string | null;

  ensemblTags: string[]= [];
  dgvTags: string[] = [];
  clinvarOmimIdTags: string[] = [];
  clinvarPhenotypeTags: string[] = [];
  overlappingTags: string[] = [];

  // mat-chip
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  readonly overlappingSeparatorKeysCodes: number[] = [ENTER];
  readonly MULTIPLE_SAMPLE_ANALYSIS = MULTIPLE_SAMPLE_ANALYSIS;

  dataSource = new MatTableDataSource<CnvInfoView>();
  selection = new SelectionModel<CnvInfoView>(true, []);
  cnvInfoViews: CnvInfoView[] = [];
  shownTableData: CnvInfoView[] = [];
  private _unsubscribeAll: Subject<void>;

  // #########################################  Constructor  #######################################
  constructor(
    public _matDialog: MatDialog,
    private detectorRef: ChangeDetectorRef,
    public service: AnalysisProcessService,
    private cdr: ChangeDetectorRef
  ) {
    this._unsubscribeAll = new Subject();
  }

  // #########################################  Life Cycle Hook #######################################
  ngOnChanges(): void {
    this.cnvInfoViews = this.mergedData?.cnvInfos
  }
  ngOnInit() {
    if (this.analysisType === MULTIPLE_SAMPLE_ANALYSIS) {
      this.displayedColumns = [
        'select',
        'no',
        'chromosome',
        'startBp',
        'endBp',
        'cnvType',
        'overlapLength',
        'samples'
      ];
    }
    this.service.onSelectedCnvChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cnvInfos: CnvInfoView[]) => {
        this.selection.clear();
        this.updateAllSelectStatus(cnvInfos, false);
        this.selection.select(...cnvInfos);
        this.detectorRef.markForCheck();
      });
  }
  ngAfterViewInit(): void {
    this.updateTableData();
    this.cdr.detectChanges();
  }

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
    const data = this.searchAll();
    this.paginator.length = data.length;
    this.shownTableData = this.slicePageData(data);
    this.dataSource.data = this.shownTableData;
  }


  slicePageData(datas: CnvInfoView[]) {
    const pageIndex = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    return datas.slice(startIndex, endIndex);
  }

  /************************* Select Row **************************/
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      // this.updateAllSelectStatus(this.mergedData.cnvInfos, false);
    } else {
      // this.dataSource.data.forEach(row => this.selection.select(row));
      this.selection.select(...this.dataSource.filteredData);
      // this.updateAllSelectStatus(this.mergedData.cnvInfos, true);
    }
    this.service.onSelectedCnv.next(this.mergedData?.cnvInfos[0]);
    this.service.onSelectedCnvChanged.next(this.selection.selected);
  }

  toggleRow(checked: boolean, cnvInfo: CnvInfoView) {
    this.selection.toggle(cnvInfo);
    cnvInfo.isSelected = checked;

    this.service.onSelectedCnvChanged.next(this.selection.selected);

    // generate interested region
    if (checked) {
      this.service.onSelectedCnv.next(cnvInfo);
    }
  }

  updateAllSelectStatus(list: CnvInfo[], isSelected: boolean) {
    for (const listMember of list) {
      listMember.isSelected = isSelected;
    }
  }
  /***************************** Filter Row *******************************/

  searchAll(){
    let isEnsembl = this.ensemblTags.length === 0;
    let isDgv = this.dgvTags.length === 0;
    let isClinvarOmimId = this.clinvarOmimIdTags.length === 0;
    let isClinvarPhenotype = this.clinvarPhenotypeTags.length === 0;
    let isOverlapping = this.overlappingTags.length === 0;

    if (isEnsembl && isDgv && isClinvarOmimId && isClinvarPhenotype && isOverlapping) return this.cnvInfoViews;

    let filteredData: CnvInfoView[] = [];
    for (const cnvInfo of this.cnvInfoViews) {
      if(!isEnsembl){
        ensemblLoop: 
        for (const ensembl of cnvInfo.ensembls) {
          for (const tag of this.ensemblTags) {
            if(ensembl.geneSymbol.toLowerCase() === tag.toLowerCase()) {
              isEnsembl = true;
              break ensemblLoop;
            }
          }
        }
      }
      
      if(!isDgv){
        dgvLoop:
        for(const dgv of cnvInfo.dgvs) {
          // [ 'duplication', 'deletion', 'gain', 'loss', 'gain+loss' ]
          const dgvAnnotations: DgvAnnotation[] = dgv.values;
          for (const dgvAnnotation of dgvAnnotations) {
            for (const tag of this.dgvTags) {
              if (
                dgvAnnotation.variantAccession.toLowerCase() ===
                tag.toLowerCase()
              ) {
                isDgv = true;
                break dgvLoop;
              }
            }
          }
        }
      }
      
      if(!isClinvarOmimId){
        clinvarOmimIdLoop:
        for (const omimId of cnvInfo.clinvar.omimIds) {
          for (const tag of this.clinvarOmimIdTags) {
            if (omimId.toLowerCase() === tag.toLowerCase()) {
              isClinvarOmimId = true;
              break clinvarOmimIdLoop;
            }
          }
        }
      }

      if(!isClinvarPhenotype){
        clinvarPhenotypLoop:
        for (const phenotype of cnvInfo.clinvar.phenotypes) {
          for (const tag of this.clinvarPhenotypeTags) {
            if (phenotype.toLowerCase().includes(tag.toLowerCase())) {
              isClinvarPhenotype = true;
              break clinvarPhenotypLoop;
            }
          }
        }
      }

      if(!isOverlapping){
        overlappingLoop:
        for (const overlap of cnvInfo.overlaps) {
          for (const tag of this.overlappingTags) {
            if (overlap.toLowerCase() === tag.toLowerCase()) {
              isOverlapping = true;
              break overlappingLoop;
            }
          }
        }
      }
      if(isEnsembl && isDgv && isClinvarOmimId && isClinvarPhenotype && isOverlapping) filteredData.push(cnvInfo);
    }

    return filteredData;
  }

  onRemoveFilterValue(index: number, filterValues: string[]): void {
    if (index >= 0) {
      filterValues.splice(index, 1);
      this.updateTableData()
    }
  }

  onClearFilterValues(filterValues: string[]): void {
    filterValues.length = 0;
    this.updateTableData();
  }

  onAddFilterValue(event: MatChipInputEvent, filterValues: string[]): void {
    const value = (event.value || '').trim();
    if (value) {
      filterValues.push(value);
    }
    event.chipInput!.clear();
  }

  onAddOverlappingFilterValue(
    event: MatChipInputEvent,
    filterValues: string[]
  ): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      filterValues.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
}
