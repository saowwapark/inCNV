import { Component, Input, OnChanges } from '@angular/core';
import { CnvInfo } from '../analysis.model';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SelectedCnvDialogComponent } from '../shared/analysis-process/selected-cnv/selected-cnv-dialog/selected-cnv-dialog.component';

@Component({
  selector: 'app-analysis-result',
  templateUrl: './analysis-result.component.html',
  styleUrls: ['./analysis-result.component.scss']
})
export class AnalysisResultComponent implements OnChanges {
  @Input() dataSource: CnvInfo[];
  displayedColumns = [
    'no',
    'chromosome',
    'startBp',
    'endBp',
    'cnvType',
    'overlaps',
    'delete'
  ];
  dialogRef: MatDialogRef<SelectedCnvDialogComponent>;
  expandedElement: string | null;

  constructor(public _matDialog: MatDialog) {}

  ngOnChanges(): void {
    console.log(this.dataSource);
  }
  deleteRow(index: number) {
    this.dataSource.splice(index, 1);
    this.dataSource = [...this.dataSource];
  }
}
