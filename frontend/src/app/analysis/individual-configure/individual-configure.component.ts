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
import { IndividualSampleConfig } from '../analysis.model';
import { AnalysisProcessService } from '../shared/analysis-process/analysis-process.service';
import { Subject } from 'rxjs';
import { MessagesService } from 'src/app/shared/components/messages/messages.service';
import { INDIVIDUAL_CONFIG } from 'src/constants/local-storage.const';

@Component({
  selector: 'app-individual-configure',
  templateUrl: './individual-configure.component.html',
  styleUrls: ['./individual-configure.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndividualConfigureComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', { static: true }) private stepper: MatStepper;

  chosenReferenceGenome: string;
  chosenSampleset: Sampleset;
  chosenSample: string;
  chosenFiles: UploadCnvToolResult[];
  chosenCnvType: string;
  chosenChr: string;
  chrs: string[];

  // private
  private _unsubscribeAll: Subject<void>;

  constructor(
    private service: AnalysisProcessService,
    private messagesService: MessagesService
  ) {
    this._unsubscribeAll = new Subject();

    this.chosenReferenceGenome = 'grch38';
    this.chosenSampleset = new Sampleset();
    this.chosenSampleset.samples = [];
    this.chosenSample = '';
    this.chosenFiles = [];
    this.chosenCnvType = 'duplication';
    this.chosenChr = '';
    this.chrs = [];
  }

  ngOnInit() {
    this.createAllChrs();
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

      // clear independent values -> chosenSample
      this.chosenSample = '';
    } else {
      this.chosenSampleset = sampleset;
    }
  }

  setSample(sample: string) {
    if (sample && sample !== this.chosenSample) {
      // update chosen sample
      this.chosenSample = sample;
    }
  }
  setSelectedFiles(files: UploadCnvToolResult[]) {
    this.chosenFiles = files;
  }

  confirmConfig() {
    const individualConfig = new IndividualSampleConfig(
      this.chosenReferenceGenome,
      this.chosenChr,
      this.chosenCnvType,
      this.chosenFiles,
      this.chosenSampleset.samplesetName,
      this.chosenSample
    );
    this.saveIndividualConfig(individualConfig);
    this.service.onIndividualSampleConfigChanged.next(individualConfig);
  }
  saveIndividualConfig(config: IndividualSampleConfig) {
    const individaulConfigString = JSON.stringify(config)
    localStorage.setItem(INDIVIDUAL_CONFIG, individaulConfigString);
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
  validateChosenSample() {
    if (this.chosenSample.length === 0) {
      const errorMessage = 'Please select one sample.';
      this.messagesService.showErrors(errorMessage);
    } else {
      this.messagesService.clearErrors();
      this.stepper.next();
    }
  }
  validateChosenFiles() {
    if (this.chosenFiles.length < 2) {
      const errorMessage = 'Please select at least two files.';
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
