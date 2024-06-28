import { UploadCnvToolResult } from 'src/app/shared/models/upload-cnv-tool-result.model';
export const MERGED_RESULT_NAME = 'Merged CNV';
export const SELECTED_RESULT_NAME = 'Selected CNV';
export const INDIVIDUAL_SAMPLE_ANALYSIS = 'individual';
export const MULTIPLE_SAMPLE_ANALYSIS = 'multiple';
export const Y_AXIS_FONT_SIZE = 14; // px
export const X_AXIS_FONT_SIZE = 13; // px
export const CHRACTER_WIDTH = 8.7; // px
export const TICK_WIDTH = 140; // px

export class IndividualSampleConfig {
  referenceGenome?: string;
  chromosome?: string;
  cnvType?: string;
  uploadCnvToolResults?: UploadCnvToolResult[];
  samplesetName?: string;
  sample?: string;

  constructor(
    refenceGenome?,
    chromosome?,
    cnvType?,
    uploadCnvToolResults?,
    samplesetName?,
    sample?
  ) {
    this.referenceGenome = refenceGenome || '';
    this.chromosome = chromosome || '';
    this.cnvType = cnvType || '';
    this.uploadCnvToolResults = uploadCnvToolResults || [];
    this.samplesetName = samplesetName || '';
    this.sample = sample || '';
  }
}

export class MultipleSampleConfig {
  referenceGenome?: string;
  chromosome?: string;
  cnvType?: string;
  uploadCnvToolResult?: UploadCnvToolResult;
  samplesetName?: string;
  samples?: string[];

  constructor(
    refenceGenome?,
    chromosome?,
    cnvType?,
    uploadCnvToolResult?,
    samplesetName?,
    samples?
  ) {
    this.referenceGenome = refenceGenome || '';
    this.chromosome = chromosome || '';
    this.cnvType = cnvType || '';
    this.uploadCnvToolResult = uploadCnvToolResult || {};
    this.samplesetName = samplesetName || '';
    this.samples = samples || [];
  }
}
export class CnvGroup {
  cnvGroupName?: string; // cnv tool name and parameter.
  cnvInfos?: CnvInfoView[]; // annotation for a given cnv tool.
}

export type IndividualProcessData = {annotatedCnvTools: CnvGroup[], annotatedMergedTool: CnvGroup};
export type MultipleProcessData = {annotatedCnvSamples: CnvGroup[], annotatedMergedTool: CnvGroup};

export class Sequence {
  chromosome?: string;
  startBp?: number;
  endBp?: number;
  sequence?: string;
}

export class CnvInfo {
  referenceGenome?: string;
  chromosome?: string;
  cnvType?: string;
  startBp?: number;
  endBp?: number;
  overlaps?: string[];
  dgvs?: DgvAnnotationKey[]; // dgv.variant_accession
  ensembls?: EnsemblAnnotation[]; // ensembl.gene_id
  clinvar?: ClinvarAnnotationList;
  leftFlanking?: Sequence;
  rightFlanking?: Sequence;
  isSelected?: boolean;
}

export interface CnvInfoView extends CnvInfo {
  overlapLength: number;
}

export function transformToCnvInfoViews(array: CnvInfo[]) {
 return array.map(data => ({...data, overlapLength: data.overlaps ? data.overlaps.length : 0}));
}
export class ClinvarAnnotationList {
  omimIds?: string[];
  phenotypes?: string[];
  clinicalSignificances?: string[];
  constructor(omimIds?, phenotypes?, clinicalSignificances?) {
    this.omimIds = omimIds || [];
    this.phenotypes = phenotypes || [];
    this.clinicalSignificances = clinicalSignificances || [];
  }
}

export class EnsemblAnnotation {
  geneId?: string;
  geneSymbol?: string;
  startBp?: number;
  endBp?: number;

  constructor(geneId?, geneSymbol?, startBp?, endBp?) {
    this.geneId = geneId || '';
    this.geneSymbol = geneSymbol || '';
    this.startBp = startBp || undefined;
    this.endBp = endBp || undefined;
  }
}

export class DgvAnnotation {
  variantAccession?: string;
  variantSubtype?: string;
  startBp?: number;
  endBp?: number;

  constructor(variantAccession?, startBp?, endBp?) {
    this.variantAccession = variantAccession || undefined;
    this.startBp = startBp || undefined;
    this.endBp = endBp || undefined;
  }
}

type VariantSubtypeKey =
  | 'duplication'
  | 'deletion'
  | 'gain'
  | 'loss'
  | 'gain+loss';

export class DgvAnnotationKey {
  key: string;
  values: DgvAnnotation[];
  constructor(key: string, values: DgvAnnotation[]) {
    this.key = key;
    this.values = values;
  }
}

export class DgvVariant {
  referenceGenome?: string;
  chromosome?: string;
  startBp?: number;
  endBp?: number;
  variantAccession?: string;
  variantType?: string;
  variantSubtype?: string;
}

export class RegionBp {
  startBp: number;
  endBp: number;

  constructor(startBp, endBp) {
    this.startBp = startBp;
    this.endBp = endBp;
  }
}
