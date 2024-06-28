import { CnvInfoDto } from './cnv-info.dto';

export class CnvSampleDto {
  sampleId?: string; // cnv tool name and parameter.
  cnvInfos?: CnvInfoDto[]; // annotation for a given cnv tool.

  constructor(sampleId?, cnvInfos?) {
    if (sampleId) {
      this.sampleId = sampleId;
      this.cnvInfos = cnvInfos;
    }
  }
}
