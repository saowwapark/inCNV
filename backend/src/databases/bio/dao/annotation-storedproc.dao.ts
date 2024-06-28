import { RegionBpDto } from './../../../dto/basepair.dto';
import * as mysql from 'mysql2/promise';
import { bioGrch37Pool, bioGrch38Pool } from '../../../config/database.config';

export class AnnotationStoredproc {
  pool: mysql.Pool;

  constructor(referenceGenome: string) {
    if (referenceGenome === 'grch37') {
      this.pool = bioGrch37Pool;
    } else if (referenceGenome === 'grch38') {
      this.pool = bioGrch38Pool;
    } else {
      throw new Error(`Reference genome is incorrect.`);
    }
  }

  public getAnnotations = async (
    userId: number,
    cnvType: string,
    chromosome: string,
    regions: RegionBpDto[]
  ): Promise<any[]> => {
    const uniqueQuery = `${userId}_${new Date().getTime()}`;
    const statement = `CALL regions_annotations(?, ?, ?, ?, @regions_annotations);select @regions_annotations;`;
    const data = [uniqueQuery, cnvType, chromosome, JSON.stringify(regions)];

    const sql = mysql.format(statement, data);
    console.log(sql);
    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(sql);
    // console.log(rows);
    // const startBp = row.startBp;
    // const endBp = row.endBp;
    // const ensemblAnnotations = row.ensemblAnnotations;
    // const dgvAnnotations = row.dgvAnnotations;
    // const clinvarAnnotations = row.clinvarAnnotations;

    return rows;
  };
}
