import { UploadCnvToolResult } from 'src/app/shared/models/upload-cnv-tool-result.model';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { IdAndName } from 'src/app/shared/models/id-and-name.model';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogAction } from 'src/app/shared/models/dialog.action.model';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.css']
})
export class UploadDialogComponent implements OnDestroy {
  samplesets: IdAndName[];
  tabFileMappings: IdAndName[];

  initialSampleset: IdAndName;
  initialTabFileMapping: IdAndName;

  action: number;
  form: FormGroup;
  dialogTitle: string;

  // mat-chip
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

  // Private
  private _unsubscribeAll: Subject<void>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    { action, tabFileMappings, samplesets, uploadCnvToolResult }: any,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<UploadDialogComponent>
  ) {
    this.action = action;

    this.tabFileMappings = tabFileMappings;
    this.samplesets = samplesets;
    this.initialTabFileMapping = this.tabFileMappings.find(
      element => element.id === uploadCnvToolResult.tabFileMappingId
    );
    this.initialSampleset = this.samplesets.find(
      element => element.id === uploadCnvToolResult.samplesetId
    );
    this.form = this._createUploadForm(uploadCnvToolResult);

    switch (action) {
      case DialogAction.New:
        this.dialogTitle = 'New Uploaded File';
        break;

      case DialogAction.Edit:
        this.dialogTitle = 'Edit Uploaded File';
        break;
    }

    this._unsubscribeAll = new Subject();
  }

  onRemoveTag(index: number): void {
    if (index >= 0) {
      const samples = this.form.get('tagDescriptions').value;
      samples.splice(index, 1);
    }
  }

  onAddTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      const tags = this.form.get('tagDescriptions').value;
      const splitedValues: string[] = value.split(/[ ,]+/);
      splitedValues.forEach(splitedValue => {
        tags.push(splitedValue.trim());
      });
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  onSave() {
    const tabFileMappingId = this.form.get('tabFileMapping').value
      ? this.form.get('tabFileMapping').value.id
      : null;
    const samplesetId = this.form.get('sampleset').value
      ? this.form.get('sampleset').value.id
      : null;

    const updated: UploadCnvToolResult = this.form.value;
    updated.tabFileMappingId = tabFileMappingId;
    updated.samplesetId = samplesetId;
    this.dialogRef.close(updated);
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  private _createUploadForm(
    uploadCnvToolResult: UploadCnvToolResult
  ): FormGroup {
    return this._fb.group({
      fileName: [uploadCnvToolResult.fileName, Validators.required],
      fileInfo: [uploadCnvToolResult.fileInfo, Validators.required],
      referenceGenome: [
        uploadCnvToolResult.referenceGenome,
        Validators.required
      ],
      cnvToolName: [uploadCnvToolResult.cnvToolName, Validators.required],
      tabFileMapping: [this.initialTabFileMapping, Validators.required],
      sampleset: [this.initialSampleset, Validators.required],
      tagDescriptions: [uploadCnvToolResult.tagDescriptions]
    });
  }
}
