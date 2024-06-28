import { NgForm } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { CnvInfo } from 'src/app/analysis/analysis.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-selected-cnv-dialog',
  templateUrl: './selected-cnv-dialog.component.html',
  styleUrls: ['./selected-cnv-dialog.component.scss']
})
export class SelectedCnvDialogComponent {
  cnv: CnvInfo;
  dialogTitle: string;

  numberMark;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    { cnvInfo }: any,
    public dialogRef: MatDialogRef<SelectedCnvDialogComponent>
  ) {
    this.dialogTitle = 'Selected CNV';
    this.cnv = cnvInfo;

    this.numberMark = createNumberMask({
      prefix: '',
      suffix: '',
      includeThousandsSeparator: true,
      thousandsSeparatorSymbol: ',',
      allowDecimal: false,
      allowNegative: false
    });
  }

  selectBasepair(form: NgForm) {
    const clonedCnvInfo = { ...this.cnv } as CnvInfo;
    clonedCnvInfo.startBp = form.controls['selectedStartBp'].value;
    clonedCnvInfo.endBp = form.controls['selectedEndBp'].value;

    this.dialogRef.close(clonedCnvInfo);
  }
}
