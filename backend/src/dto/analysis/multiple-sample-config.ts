import { UploadCnvToolResultDto } from '../../databases/incnv/dto/upload-cnv-tool-result.dto';

export class MultipleSampleConfigDto {
  referenceGenome?: string;
  chromosome?: string;
  cnvType?: string;
  uploadCnvToolResult?: UploadCnvToolResultDto;
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
