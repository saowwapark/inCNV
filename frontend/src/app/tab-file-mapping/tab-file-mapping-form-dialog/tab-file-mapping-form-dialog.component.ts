import { duplicationKeyValidator } from './../../shared/directives/custom.validator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TabFileMapping } from '../tab-file-mapping.model';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig
} from '@angular/material/dialog';

import { Component, OnInit, Inject } from '@angular/core';
import { deletionKeyValidator } from 'src/app/shared/directives/custom.validator';
@Component({
  selector: 'tab-file-mapping-form',
  templateUrl: './tab-file-mapping-form-dialog.component.html',
  styleUrls: ['./tab-file-mapping-form-dialog.component.scss']
})
export class TabFileMappingFormDialogComponent implements OnInit {
  fileMappingConfigured: TabFileMapping;
  form: FormGroup;
  dialogTitle: string;
  action: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    public matDialogRef: MatDialogRef<TabFileMappingFormDialogComponent>,
    private _fb: FormBuilder
  ) {}

  ngOnInit() {
    this.action = this._data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit CNV Tool';
      this.fileMappingConfigured = this._data.fileMappingConfigured;
    } else {
      this.dialogTitle = 'New CNV Tool';
      this.fileMappingConfigured = new TabFileMapping();
    }
    this.form = this._createTabFileMappingForm();

    this.matDialogRef.addPanelClass('tab-file-mapping-dialog');
    // this.matDialogRef.updateSize('85%', '90%');
  }

  private _createTabFileMappingForm(): FormGroup {
    return this._fb.group({
      tabFileMappingName: [
        this.fileMappingConfigured.tabFileMappingName,
        Validators.required
      ],
      headerColumnMapping: this._fb.group({
        sample: [
          this.fileMappingConfigured.headerColumnMapping.sample,
          Validators.required
        ],
        chromosome: [
          this.fileMappingConfigured.headerColumnMapping.chromosome,
          Validators.required
        ],
        startBp: [
          this.fileMappingConfigured.headerColumnMapping.startBp,
          Validators.required
        ],
        endBp: [
          this.fileMappingConfigured.headerColumnMapping.endBp,
          Validators.required
        ],
        cnvType: [
          this.fileMappingConfigured.headerColumnMapping.cnvType,
          Validators.required
        ]
      }),
      dataFieldMapping: this._fb.group({
        chromosome22: [
          this.fileMappingConfigured.dataFieldMapping.chromosome22,
          Validators.required
        ],
        duplication: [
          this.fileMappingConfigured.dataFieldMapping.duplication,
          [Validators.required, duplicationKeyValidator()]
        ],
        deletion: [
          this.fileMappingConfigured.dataFieldMapping.deletion,
          [Validators.required, deletionKeyValidator()]
        ]
      })
    });
  }

  private _editTabFileMappingForm(
    fileMappingConfigured: TabFileMapping
  ): FormGroup {
    return this._fb.group({
      tabFileMappingName: [
        fileMappingConfigured.tabFileMappingName,
        Validators.required
      ],
      headerColumnMapping: this._fb.group({
        sample: [
          fileMappingConfigured.headerColumnMapping.sample,
          Validators.required
        ],
        chromosome: [
          fileMappingConfigured.headerColumnMapping.chromosome,
          Validators.required
        ],
        startBp: [
          fileMappingConfigured.headerColumnMapping.startBp,
          Validators.required
        ],
        endBp: [
          fileMappingConfigured.headerColumnMapping.endBp,
          Validators.required
        ],
        cnvType: [
          fileMappingConfigured.headerColumnMapping.cnvType,
          Validators.required
        ]
      }),
      dataFieldMapping: this._fb.group({
        chromosome22: [
          fileMappingConfigured.dataFieldMapping.chromosome22,
          Validators.required
        ],
        duplication: [
          fileMappingConfigured.dataFieldMapping.duplication,
          [Validators.required, duplicationKeyValidator()]
        ],
        deletion: [
          fileMappingConfigured.dataFieldMapping.deletion,
          [Validators.required, deletionKeyValidator()]
        ]
      })
    });
  }
}
