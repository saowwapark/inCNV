export class UploadCnvToolResult {
  uploadCnvToolResultId: number;
  fileName: string;
  fileInfo: string;
  referenceGenome: string;
  cnvToolName: string;
  tabFileMappingId: number;
  tabFileMappingName: string;
  samplesetId: number;
  samplesetName: string;
  tagDescriptions: string[]; // can be null
  createDate: Date;
  modifyDate: Date;
  constructor(upload?) {
    {
      if (upload) {
        this.uploadCnvToolResultId = upload.uploadCnvToolResultId || 0;
        this.fileName = upload.fileName || '';
        this.fileInfo = upload.fileInfo || '';
        this.referenceGenome = upload.referenceGenome || '';
        this.cnvToolName = upload.cnvToolName || '';
        this.tabFileMappingId = upload.tabFileMappingId;
        this.tabFileMappingName = upload.tabFileMappingName || '';
        this.samplesetId = upload.samplesetId;
        this.samplesetName = upload.samplesetName || '';
        this.tagDescriptions = upload.tagDescriptions || '';
        this.createDate = upload.createDate;
        this.modifyDate = upload.modifyDate;
      }
    }
  }
}
