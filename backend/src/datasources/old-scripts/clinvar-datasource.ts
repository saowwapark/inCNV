import fs from 'fs';
import { bioGrch37Pool, bioGrch38Pool } from '../../config/database.config';
import mysql from 'mysql2/promise';

/**
 *  This version keep omim_id_list in form of separed string by semi-colon
 */
export class ClinvarDataSource {
  filePath;
  constructor(filePath) {
    this.filePath = filePath;
  }
  createClinvarTable = async () => {
    await bioGrch37Pool.execute(`DROP TABLE IF EXISTS clinvar`);
    await bioGrch38Pool.execute(`DROP TABLE IF EXISTS clinvar`);
    const sql = `CREATE TABLE clinvar (
      clinvar_id int(3) unsigned NOT NULL AUTO_INCREMENT,
      allele_id int(11) DEFAULT NULL,
      type varchar(45) DEFAULT NULL,
      name varchar(800),
      gene_id varchar(45) DEFAULT NULL,
      gene_symbol varchar(700),
      hgnc_id varchar(45) DEFAULT NULL,
      clinical_significance varchar(128) DEFAULT NULL,
      last_evaluated date DEFAULT NULL,
      rs_dbSNP varchar(45) DEFAULT NULL,
      omim_id_list varchar(255),
      phenotype_list varchar(1300),
      chromosome varchar(5)  NOT NULL,
      start_bp int(4) unsigned NOT NULL,
      end_bp int(4) unsigned NOT NULL,
      cytogenetic varchar(45) DEFAULT NULL,
      PRIMARY KEY (clinvar_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`;
    console.log(sql);
    await bioGrch37Pool.query(sql);
    await bioGrch38Pool.query(sql);
  };

  addClinvar = async ([mapped_grch37, mapped_grch38]) => {
    const sql = `INSERT INTO clinvar ( 
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
    const statement_grch37 = mysql.format(sql, [mapped_grch37]);
    // console.log(statement_grch37);
    const [resultSetHeader_grch37] = await bioGrch37Pool.query(
      statement_grch37
    );

    const statement_grch38 = mysql.format(sql, [mapped_grch38]);
    // console.log(statement_grch38);
    const [resultSetHeader_grch38] = await bioGrch38Pool.query(
      statement_grch38
    );
  };

  // return [any[], any[]]
  mapDataSource = () => {
    const context = fs.readFileSync(this.filePath, 'utf8');
    const lines = context.split('\n');

    const datalist_grch37: any[] = [];
    const datalist_grch38: any[] = [];

    for (const line of lines) {
      // line space
      if (!line || line === '') continue;

      //ignore a commented line
      if (line.charAt(0) === '#') continue;

      const columns = line.split('\t');

      const allele_id = columns[0],
        type = columns[1],
        name = columns[2],
        gene_id = columns[3],
        gene_symbol = columns[4],
        hgnc_id = columns[5],
        clinical_significance = columns[6],
        last_evaluated = columns[8],
        rs_dbSNP = columns[9],
        phenotype_ids = columns[12].split(';'),
        phenotype_list = columns[13],
        chr = columns[18],
        start = columns[19],
        end = columns[20],
        cytogenetic = columns[23];

      if (!chr || chr === 'na') continue;

      let omim_id_list = '';
      const assembly = columns[16];
      for (const phenotype_id of phenotype_ids) {
        const fragments = phenotype_id.split(',');
        for (const fragment of fragments) {
          if (fragment.substring(0, 4) === 'OMIM') {
            const omim_id = fragment.substring(5, 11);
            if (omim_id_list.length === 0) {
              omim_id_list = omim_id;
            } else {
              omim_id_list += `;${omim_id}`;
            }
            break;
          }
        }
      }

      // keep only have omim_id_list
      if (!omim_id_list) continue;

      const data = [
        allele_id,
        type,
        name,
        gene_id,
        gene_symbol,
        hgnc_id ? hgnc_id.substring(5) : hgnc_id,
        clinical_significance,
        new Date(last_evaluated),
        rs_dbSNP,
        omim_id_list,
        phenotype_list,
        chr,
        start,
        end,
        cytogenetic
      ];
      if (assembly === 'GRCh37') {
        datalist_grch37.push(data);
      } else {
        datalist_grch38.push(data);
      }
    }

    return [datalist_grch37, datalist_grch38];
  };

  main = async () => {
    console.log('Mapping Clivar both GRCh37 and GRCh38');
    const [datalist_grch37, datalist_grch38] = this.mapDataSource();
    await this.createClinvarTable();
    await this.addClinvar([datalist_grch37, datalist_grch38]);
    console.log('Mapping Clinvar SUCCESS!!');
  };
}

// async main() {
//   const [datalist_grch37, datalist_grch38] = this.mapDataSource();
//   await this.createClinvarTable();
//   await this.addClinvar([datalist_grch37, datalist_grch38]);
//   console.log('SUCCESS!!');
// }
