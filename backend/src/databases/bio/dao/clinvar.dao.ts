import * as mysql from 'mysql2/promise';
import { bioGrch37Pool, bioGrch38Pool } from '../../../config/database.config';
import { ClinvarDto } from '../dto/clinvar.dto';

export class ClinvarDao {
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

  public getClinvar = async (
    chromosome: string,
    startBp: number,
    endBp: number
  ): Promise<ClinvarDto[]> => {
    const statement = `SELECT omim_id_list, phenotype_list, clinical_significance
                  FROM clinvar
                  WHERE chromosome = ? 
                    AND (start_bp BETWEEN ? AND ? OR end_bp BETWEEN ? AND ?)
                  ORDER BY start_bp, end_bp`;
    const data = [chromosome, startBp, endBp, startBp, endBp];

    const sql = mysql.format(statement, data);
    // console.log(sql);
    const [rows] = await this.pool.query<mysql.RowDataPacket[]>(sql);
    let clinvars: ClinvarDto[] = [];
    rows.forEach(row => {
      const clinvar = new ClinvarDto();
      clinvar.omimIdList = row.omim_id_list;
      clinvar.phenotypeList = row.phenotype_list;
      clinvar.clinicalSignificance = row.clinical_significance;
      clinvars.push(clinvar);
    });
    return clinvars;
  };

  addClinvar = async (mapped: any[]) => {
    const sql = `INSERT INTO clinvar (
          clinvar_id, 
          allele_id,
          type,
          name,
          gene_id,
          gene_symbol,
          hgnc_id,
          clinical_significance,
          last_evaluated,
          rs_dbSNP,
          omim_id_list,
          phenotype_list,
          chromosome,
          start_bp,
          end_bp,
          cytogenetic) VALUES ?`;
    const statement = mysql.format(sql, mapped);
    console.log(statement);
    const [resultSetHeader] = await this.pool.query(statement);
    console.log(resultSetHeader);
  };
}
