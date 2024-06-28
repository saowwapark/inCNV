import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { MultipleConfigureService } from 'src/app/analysis/multiple-configure/multiple-configure.service';
import { findDuplicates } from './../../utils/logic.utils';
import { UploadCnvToolResult } from '../../shared/models/upload-cnv-tool-result.model';
import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Sampleset } from '../../sampleset/sampleset.model';
import { MultipleSampleConfig } from '../analysis.model';
import { AnalysisProcessService } from '../shared/analysis-process/analysis-process.service';
import { Subject } from 'rxjs';
import { MessagesService } from 'src/app/shared/components/messages/messages.service';
import { MULTIPLE_CONFIG } from 'src/constants/local-storage.const';

@Component({
  selector: 'app-multiple-configure',
  templateUrl: './multiple-configure.component.html',
  styleUrls: ['./multiple-configure.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultipleConfigureComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', { static: true }) private stepper: MatStepper;

  chosenReferenceGenome: string;
  chosenSampleset: Sampleset;
  chosenSamples: string[];
  chosenFile: UploadCnvToolResult;
  chosenCnvType: string;
  chosenChr: string;
  chrs: string[];

  // private
  private _unsubscribeAll: Subject<void>;

  constructor(
    private processService: AnalysisProcessService,
    private configureService: MultipleConfigureService,
    private messagesService: MessagesService
  ) {
    this._unsubscribeAll = new Subject();

    this.chosenReferenceGenome = 'grch38';
    this.chosenSampleset = new Sampleset();
    this.chosenSampleset.samples = [];
    this.chosenSamples = [];
    this.chosenFile = new UploadCnvToolResult();
    this.chosenCnvType = 'duplication';
    this.chosenChr = '';
    this.chrs = [];
  }

  ngOnInit() {
    this.createAllChrs();

    this.configureService.onSelectedSamplesChanged
      .pipe(distinctUntilChanged(), takeUntil(this._unsubscribeAll))
      .subscribe(selectedSamples => {
        this.chosenSamples = selectedSamples;
        this.chosenFile = new UploadCnvToolResult();
      });
  }

  createAllChrs() {
    for (let i = 1; i < 23; i++) {
      this.chrs.push(String(i));
    }
    this.chrs.push('x');
    this.chrs.push('y');
  }

  goToPreviousStep() {
    this.stepper.previous();
  }

  goToNexStep() {
    this.stepper.next();
  }

  setSampleset(sampleset: Sampleset) {
    if (sampleset && sampleset !== this.chosenSampleset) {
      // update chosen sampleset
      this.chosenSampleset = sampleset;

      // clear independent values -> chosenSamples and chosenFile
      this.chosenSamples = [];
      this.configureService.onSelectedSamplesChanged.next([]);
      this.chosenFile = new UploadCnvToolResult();
    } else {
      this.chosenSampleset = sampleset;
    }
  }

  setFile(file: UploadCnvToolResult) {
    this.chosenFile = file;
  }

  confirmConfig() {
    const multipleConfig = new MultipleSampleConfig(
      this.chosenReferenceGenome,
      this.chosenChr,
      this.chosenCnvType,
      this.chosenFile,
      this.chosenSampleset.samplesetName,
      this.chosenSamples
    );
    this.saveConfig(multipleConfig);
    this.processService.onMultipleSampleConfigChanged.next(multipleConfig);
  }

  saveConfig(config: MultipleSampleConfig) {
    const multipleConfigString = JSON.stringify(config)
    localStorage.setItem(MULTIPLE_CONFIG, multipleConfigString);
  }

  validateChosenSampleset() {
    if (!this.chosenSampleset.samplesetId) {
      const errorMessage = 'Please select one sample set.';
      this.messagesService.showErrors(errorMessage);
    } else {
      this.messagesService.clearErrors();
      this.stepper.next();
    }
  }

  validateChosenSamples() {
    // // remove not selection (in case accepting not selection)
    // const realSamples = this.chosenSamples.filter(
    //   (sample, index) => sample !== ''
    // );
    // // update this.chosenSamples
    // this.chosenSamples = realSamples;

    // check length
    if (this.chosenSamples.length < 2) {
      const errorMessage = 'Please select at least two samples.';
      this.messagesService.showErrors(errorMessage);
      return null;
    }

    // check duplication
    const allDuplicatedSamples = findDuplicates(this.chosenSamples);
    if (allDuplicatedSamples.length > 0) {
      const errorMessage = `Duplicated at ${allDuplicatedSamples.join(', ')}`;
      this.messagesService.showErrors(errorMessage);
      return null;
    }
    this.messagesService.clearErrors();
    this.stepper.next();
  }

  validateChosenFile() {
    if (!this.chosenFile.uploadCnvToolResultId) {
      const errorMessage = 'Please select one file.';
      this.messagesService.showErrors(errorMessage);
    } else {
      this.messagesService.clearErrors();
      this.stepper.next();
    }
  }

  validateChosenChromosome() {
    if (this.chosenChr.length === 0) {
      const errorMessage = 'Please select one chromosome.';
      this.messagesService.showErrors(errorMessage);
    } else {
      this.messagesService.clearErrors();
      this.stepper.next();
    }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
