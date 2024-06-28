import { TabFileMappingService } from '../../../tab-file-mapping/tab-file-mapping.service';
import { UploadFormService } from './upload-form.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';

import { UploadCnvToolResult } from '../../../shared/models/upload-cnv-tool-result.model';
import { IdAndName } from 'src/app/shared/models/id-and-name.model';
import { SamplesetService } from 'src/app/sampleset/sampleset.service';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit, OnDestroy {
  @ViewChild('samplesetInput', { static: true }) samplesetInput: ElementRef;
  @ViewChild('tabFileMappingInput', { static: true })
  tabFileMappingInput: ElementRef;
  uploadPost: any;
  form: FormGroup;
  filePreview: string;

  tabFileMappings: IdAndName[] = [];

  samplesets: IdAndName[] = [];

  tagDescriptions: string[] = [];
  @Output()
  confirmClicked = new EventEmitter<any>();

  isUploading: BehaviorSubject<boolean>;
  private _unsubscribeAll: Subject<void>;

  // Tag
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  // Auto Complete

  constructor(
    private _formBuilder: FormBuilder,
    private _samplesetService: SamplesetService,
    private _tabFileMappingService: TabFileMappingService,
    private _uploadFormService: UploadFormService,
    private _router: Router
  ) {
    this.samplesets = [];
    this.isUploading = new BehaviorSubject(false);
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit() {
    this.form = this._createUploadForm();

    this._samplesetService.onTriggerDataChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._samplesetService.getIdAndNames().subscribe(sampleset => {
          this.samplesets = sampleset;
        });
      });

    this._tabFileMappingService.onTriggerDataChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._tabFileMappingService
          .getIdAndNames()
          .subscribe(tabFileMappings => {
            this.tabFileMappings = tabFileMappings;
          });
      });
    // this._tabFileMappingService.getIdAndNames().subscribe(tabFileMappings => {
    //   this.tabFileMappings = tabFileMappings;
    // });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _createUploadForm(): FormGroup {
    this.uploadPost = new UploadCnvToolResult({});
    return this._formBuilder.group({
      fileName: [this.uploadPost.fileName, Validators.required],
      uploadedFile: [this.uploadPost.uploadedFile],
      fileInfo: [],
      referenceGenome: ['grch38'],

      cnvToolName: [null, Validators.required],
      tabFileMapping: [null], // only 'file_type' is Tab File Format
      sampleset: [null],
      tagDescriptions: [null]
    });
  }

  private _clearUploadForm(): void {
    this.form.get('fileName').setValue('');
    this.form.get('uploadedFile').setValue('');
    this.form.get('fileInfo').setValue('');
    this.form.get('referenceGenome').setValue('');
    this.form.get('cnvToolName').setValue('');
    this.form.get('tabFileMapping').setValue('');
    this.form.get('sampleset').setValue('');
    this.form.get('tagDescriptions').setValue('');
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  onAddTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.tagDescriptions.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  onRemoveTag(tag: string): void {
    const index = this.tagDescriptions.indexOf(tag);

    if (index >= 0) {
      this.tagDescriptions.splice(index, 1);
    }
  }

  onFilePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.controls['fileName'].setValue(file.name);
    this.form.patchValue({ uploadedFile: file });
    this.form.controls['uploadedFile'].updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      // this.filePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onConfirm() {
    this.onSaveUpload();
  }
  onSaveUpload() {
    this.isUploading.next(true);

    const file = this.form.controls['uploadedFile'].value as File;
    const uploadCnvToolResult = new UploadCnvToolResult({
      fileName: this.form.get('fileName').value,
      // 'filePath' will be created at backend side
      fileInfo: this.form.get('fileInfo').value,
      referenceGenome: this.form.get('referenceGenome').value,
      cnvToolName: this.form.get('cnvToolName').value,
      tabFileMappingId: this.form.get('tabFileMapping').value
        ? this.form.get('tabFileMapping').value.id
        : null,
      samplesetId: this.form.get('sampleset').value
        ? this.form.get('sampleset').value.id
        : null,
      tagDescriptions: this.tagDescriptions
    });

    this._uploadFormService
      .addUploadCnvToolResult(uploadCnvToolResult, file)
      .subscribe(uploadCnvToolResultId => {
        this.isUploading.next(false);
        this.confirmClicked.emit(uploadCnvToolResultId);
      });
  }

  onReset() {
    this.form.reset();
    this.tagDescriptions = [];
  }
  onLoadSamplesetPage() {
    this._router.navigate([]).then(result => {
      window.open('/sampleset', '_blank');
    });
  }

  onLoadTabFileMappingPage() {
    this._router.navigate([]).then(result => {
      window.open('/tabfilemapping', '_blank');
    });
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.isUploading.unsubscribe();

    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
