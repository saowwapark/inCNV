import { CnvInfoDto } from './cnv-info.dto';

export class CnvGroupDto {
  cnvGroupName?: string; // cnv tool name or sample name.
  cnvInfos?: CnvInfoDto[]; // annotation for a given cnv tool.

  constructor(cnvGroupName?, cnvInfos?) {
    this.cnvGroupName = cnvGroupName || '';
    this.cnvInfos = cnvInfos || [];
  }
}
