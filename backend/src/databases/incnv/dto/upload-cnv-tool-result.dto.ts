export class UploadCnvToolResultDto {
  uploadCnvToolResultId?: number;
  userId?: number;
  fileName?: string;
  fileInfo?: string;
  referenceGenome?: string;
  cnvToolName?: string;
  tabFileMappingId?: number;
  tabFileMappingName?: string;
  samplesetId?: number;
  samplesetName?: string;
  tagDescriptions?: string[];
  createDate?: Date;
  modifyDate?: Date;
}

export class UploadCnvToolResultViewDto extends UploadCnvToolResultDto {
  tabFileMappingName?: string;
  samplesetName?: string;
}
