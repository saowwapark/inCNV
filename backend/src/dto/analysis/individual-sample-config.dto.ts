import { UploadCnvToolResultDto } from './../../databases/incnv/dto/upload-cnv-tool-result.dto';
export class IndividualSampleConfigDto {
  referenceGenome?: string;
  chromosome?: string;
  cnvType?: string;
  uploadCnvToolResults?: UploadCnvToolResultDto[];
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
