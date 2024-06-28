export interface HeaderColumnMapping {
  sample?: string;
  chromosome?: string;
  startBp?: string;
  endBp?: string;
  cnvType?: string;
}

export interface DataFieldMapping {
  chromosome22?: string;
  duplication?: string;
  deletion?: string;
}

export interface HeaderColumnIndex {
  sampleIndex?: number;
  chromosomeIndex?: number;
  startBpIndex?: number;
  endBpIndex?: number;
  cnvTypeIndex?: number;
}

export class TabFileMappingDto {
  tabFileMappingId?: number;
  userId?: number;
  tabFileMappingName?: string;
  createDate?: Date;
  modifyDate?: Date;
  headerColumnMapping?: HeaderColumnMapping;
  dataFieldMapping?: DataFieldMapping;

  constructor(a?) {
    if (a) {
      this.tabFileMappingId = a.tabFileMappingId;
      this.userId = a.userId;
      this.tabFileMappingName = a.tabFileMappingName;
      this.createDate = a.createDate;
      this.modifyDate = a.modifyDate;
      this.headerColumnMapping = a.headerColumnMapping;
      this.dataFieldMapping = a.dataFieldMapping;
    }
  }
}
