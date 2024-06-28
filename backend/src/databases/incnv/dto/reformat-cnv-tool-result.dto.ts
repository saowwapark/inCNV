export class ReformatCnvToolResultDto {
  reformatCnvToolResultId?: number;
  uploadCnvToolResultId?: number;
  sample?: string;
  chromosome?: string;
  startBp?: number;
  endBp?: number;
  cnvType?: string;

  constructor(a?) {
    if (a) {
      this.reformatCnvToolResultId = a.reformatCnvToolResultId;
      this.uploadCnvToolResultId = a.uploadCnvToolResultId;
      this.sample = a.sample;
      this.chromosome = a.chromosome;
      this.startBp = a.startBp;
      this.endBp = a.endBp;
      this.cnvType = a.cnvType;
    }
  }
}
