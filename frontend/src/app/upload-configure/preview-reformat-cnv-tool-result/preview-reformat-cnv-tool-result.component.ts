import {
  Component,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-preview-reformat-cnv-tool-result',
  templateUrl: './preview-reformat-cnv-tool-result.component.html',
  styleUrls: ['./preview-reformat-cnv-tool-result.component.scss']
})
export class PreviewReformatCnvToolResultComponent implements OnDestroy {
  @Input() uploadCnvToolResultId: number;

  @Output()
  previousStep = new EventEmitter<any>();
  @Output() nextStep = new EventEmitter<any>();

  private _unsubscribeAll: Subject<void>;

  constructor() {
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * New Sampleset
   */

  goToPreviousStep() {
    this.previousStep.next();
  }

  goToNextStep() {
    this.nextStep.next();
  }
}
