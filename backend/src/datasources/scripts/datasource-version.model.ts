export class DatasourceVersion {
  latestReleasedVersion: string = '';
  dbVersions: DatabaseVersion[] = [];
  dgvAllVariantsVersions: FileVersion[] = [];
  referenceGenomeGrch37Versions: FileVersion[] = [];
  referenceGenomeGrch38Versions: FileVersion[] = [];
}

export class DatabaseVersion {
  databaseName: string = '';
  tables: TableVersion[] = [];
}

export class TableVersion {
  tableName: string = '';
  releasedVersion: string = ''; // git hub released version
  srcReleasedDate: string = ''; // source released date
}

export class FileVersion {
  fileName: string = '';
  releasedVersion: string = '';
  srcReleasedDate: string = '';
}
