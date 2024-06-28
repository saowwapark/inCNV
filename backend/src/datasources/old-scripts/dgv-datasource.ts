import fs from 'fs';
import { bioGrch37Pool, bioGrch38Pool } from '../../config/database.config';
import mysql from 'mysql2/promise';

export class DgvDataSource {
  pool;
  filePath: string;
  reference: string;

  constructor(reference: string, filePath: string) {
    if (reference === 'grch37') {
      this.reference = reference;
      this.pool = bioGrch37Pool;
      this.filePath = filePath;
    } else if (reference === 'grch38') {
      this.reference = reference;
      this.pool = bioGrch38Pool;
      this.filePath = filePath;
    } else {
      throw `Error! need to specify reference: 'grch37' or 'grch38'`;
    }
  }

  createVariantTable = async () => {
    await this.pool.execute(`DROP TABLE IF EXISTS dgv`);
    const sql = `CREATE TABLE dgv (
  variant_accession varchar(20) NOT NULL,
  chromosome varchar(45) NOT NULL,
  start_bp int(4) unsigned NOT NULL,
  end_bp int(4) unsigned DEFAULT NULL,
  variant_type varchar(45) DEFAULT NULL,
  variant_subtype varchar(45) DEFAULT NULL,
  reference varchar(255) DEFAULT NULL,
  pubmed_id varchar(45) DEFAULT NULL,
  method varchar(255) DEFAULT NULL,
  platform varchar(45) DEFAULT NULL,
  supporting_variants varchar(35000) DEFAULT NULL,
  genes varchar(1200) DEFAULT NULL,
  samples varchar(22000) DEFAULT NULL,
  PRIMARY KEY (variant_accession)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;`;

    console.log(sql);
    await this.pool.query(sql);
  };

  addVaraints = async mapped => {
    const sql = mysql.format(
      `INSERT INTO variant (
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
          ) VALUES ?`,
      [mapped]
    );

    console.log(sql);
    const [resultSetHeader] = await this.pool.query(sql);
    console.log(resultSetHeader);
  };

  mapDataSource = () => {
    // read file
    const context = fs.readFileSync(this.filePath, 'utf8');
    const lines = context.split('\n');

    const datalist: any[] = [];
    for (const line of lines) {
      // line space
      if (!line || line === '') continue;

      //ignore a commented line
      if (line.charAt(0) === '#') continue;

      const columns = line.split('\t');

      const variant_accession = columns[0],
        chromosome = columns[1],
        start_bp = columns[2],
        end_bp = columns[3],
        variant_type = columns[4],
        variant_subtype = columns[5],
        reference = columns[6],
        pubmed_id = columns[7],
        method = columns[8],
        platform = columns[9],
        supporting_variants = columns[11],
        genes = columns[18],
        samples = columns[19];

      if (variant_type !== 'CNV') continue;

      const chosenVariantSubType = new Set([
        'gain',
        'loss',
        'gain+loss',
        'duplication',
        'del'
      ]);
      if (!chosenVariantSubType.has(variant_subtype)) continue;

      const data = [
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
      ];

      datalist.push(data);
    }
    return datalist;
  };

  main = async () => {
    console.log(`Mapping Ensembl on ${this.reference}`);
    const dataSource = this.mapDataSource();
    await this.createVariantTable();
    await this.addVaraints(dataSource);
    console.log('Map DGV success!!');
  };
}
