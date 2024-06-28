/*************************** Front End *****************************/

export class HeaderColumnMapping {
  sample: string;
  chromosome: string;
  startBp: string;
  endBp: string;
  cnvType: string;
}
export class DataFieldMapping {
  chromosome22: string;
  duplication: string;
  deletion: string;
}
export class TabFileMapping {
  tabFileMappingId: number;
  userId: number;
  tabFileMappingName: string;
  headerColumnMapping: HeaderColumnMapping;
  dataFieldMapping: DataFieldMapping;

  constructor(tabFileMapping?) {
    if (tabFileMapping) {
      this.tabFileMappingId = tabFileMapping.id;
      this.userId = tabFileMapping.owerId;
      this.tabFileMappingName = tabFileMapping.cnvToolName;
      this.headerColumnMapping = tabFileMapping.headerColumnMapping;
      this.dataFieldMapping = tabFileMapping.dataFieldMapping;
    } else {
      this.headerColumnMapping = new HeaderColumnMapping();
      this.dataFieldMapping = new DataFieldMapping();
    }
  }
}
