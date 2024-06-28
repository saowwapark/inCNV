import { Component } from '@angular/core';
import { Sampleset } from '../sampleset/sampleset.model';
import { UploadCnvToolResult } from '../shared/models/upload-cnv-tool-result.model';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent {
  chosenReferenceGenome: string;
  chosenSampleset: Sampleset;
  chosenSample: string;
  chosenFiles: UploadCnvToolResult[];
  chosenCnvType: string;
  chosenChr: string;

  constructor() {}
}
