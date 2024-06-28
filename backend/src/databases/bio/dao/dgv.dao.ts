import { RegionBpDto } from './../../../dto/basepair.dto';
import * as mysql from 'mysql2/promise';
import { bioGrch37Pool, bioGrch38Pool } from '../../../config/database.config';
import { DgvAnnotationDto } from '../dto/dgv-annotation.dto';

export class DgvDao {
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

  // public getAllDgvs = async (chromosome: string) => {
  //   const statement = `SELECT variant_accession, start_bp, end_bp FROM dgv
  //                 WHERE chromosome = ? AND variant_subtype in (?)

  //                 ORDER BY start_bp, end_bp`;
  //   const data = [chromosome, variantSubtype];

  //   const sql = mysql.format(statement, data);
  //   // console.log(sql);
  //   const [rows] = await this.pool.query<mysql.RowDataPacket[]>(sql);
  //   const dgvAnnotations: DgvAnnotationDto[] = [];
  //   rows.forEach(row => {
  //     const variant = row.variant_accession;
  //     const basepair = new RegionBpDto(row.start_bp, row.end_bp);
  //     dgvAnnotations.push(new DgvAnnotationDto(variant, basepair));
  //   });
  //   return dgvAnnotations;
  // };

  public getVariantAccessions = async (
    chromosome: string,
    startBp: number,
    endBp: number
  ): Promise<DgvAnnotationDto[]> => {
    const statement = `SELECT variant_accession, start_bp, end_bp, variant_subtype 
                  FROM dgv
                  WHERE chromosome = ? 
                    AND (start_bp BETWEEN ? AND ? OR end_bp BETWEEN ? AND ?)
                  ORDER BY start_bp, end_bp`;
    const data = [chromosome, startBp, endBp, startBp, endBp];

    const sql = mysql.format(statement, data);
    // console.log(sql);
    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(sql);
    const dgvAnnotations: DgvAnnotationDto[] = [];
    rows.forEach(row => {
      const variant = row.variant_accession;
      const startBp = row.start_bp;
      const endBp = row.end_bp;
      const variantSubtype = row.variant_subtype;
      dgvAnnotations.push(
        new DgvAnnotationDto(variant, startBp, endBp, variantSubtype)
      );
    });
    return dgvAnnotations;
  };

  addVaraints = async (mapped: any[]) => {
    const sql = `INSERT INTO dgv (
          variant_accession,
          chromosome,
          start_bp,
          end_bp,
          variant_type,
          variant_subtype,
          reference,
          pubmed_id,
          method,
          platform,
          supporting_variants,
          genes,
          samples
          ) VALUES ?`;

    const statement = mysql.format(sql, mapped);
    console.log(statement);
    const [resultSetHeader] = await this.pool.query(statement);
    console.log(resultSetHeader);
  };
}
