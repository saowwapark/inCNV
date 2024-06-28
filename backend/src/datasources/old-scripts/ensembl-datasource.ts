import fs from 'fs';
import { bioGrch37Pool, bioGrch38Pool } from '../../config/database.config';
import * as mysql from 'mysql2/promise';

export class EnsemblDataSource {
  pool;
  reference;
  ensemblFilePath;
  geneSymbolFilePath;

  constructor(reference, ensemblFilePath, geneSymbolFilePath) {
    if (reference === 'grch37') {
      this.reference = reference;
      this.pool = bioGrch37Pool;
      this.ensemblFilePath = ensemblFilePath;
      this.geneSymbolFilePath = geneSymbolFilePath;
    } else {
      this.reference = reference;
      this.pool = bioGrch38Pool;
      this.ensemblFilePath = ensemblFilePath;
      this.geneSymbolFilePath = geneSymbolFilePath;
    }
  }
  createGeneTable = async () => {
    await this.pool.execute(`DROP TABLE IF EXISTS ensembl`);
    const sql = `CREATE TABLE ensembl (
      gene_id VARCHAR(15) NOT NULL,
      gene_type VARCHAR(45) NULL,
      gene_symbol VARCHAR(45),
      chromosome VARCHAR(10) NULL,
      start_bp INT(10) NULL,
      end_bp INT(10) NULL,
      PRIMARY KEY (gene_id)) ENGINE=InnoDB DEFAULT CHARSET=latin1;`;

    console.log(sql);
    await this.pool.query(sql);
  };

  addGene = async mapped => {
    console.log(mapped[0]);
    const sql = mysql.format(
      `INSERT INTO ensembl (gene_id, gene_type, gene_symbol, chromosome, start_bp, end_bp) VALUES ?`,
      [mapped]
    );

    console.log(sql);
    const [resultSetHeader] = await this.pool.query(sql);
    console.log(resultSetHeader);
  };

  mapDataSource = () => {
    const geneSymbolDataList = this.mapGeneSymbolDataSource();

    // read file
    const context = fs.readFileSync(this.ensemblFilePath, 'utf8');
    const lines = context.split('\n');

    const datalist: any[] = [];
    for (const line of lines) {
      // line space
      if (!line || line === '') continue;

      //ignore a commented line
      if (line.charAt(0) === '#') continue;

      const columns = line.split('\t');

      const chr = columns[0];
      const type = columns[2];
      const start = columns[3];
      const end = columns[4];
      const attributes = columns[8].split(';');

      //ignore a biological_region line
      if (type === 'biological_region') continue;

      //ID=gene:ENSG00000279516
      const firstAttr = attributes[0];
      if (firstAttr.slice(0, 7) === 'ID=gene') {
        const geneId = firstAttr.slice(8);

        for (const geneSymbolData of geneSymbolDataList) {
          if (geneSymbolData[0] === geneId) {
            datalist.push([geneId, type, geneSymbolData[1], chr, +start, +end]);
            break;
          }
        }
      }
    }
    return datalist;
  };

  // return [any[], any[]]
  mapGeneSymbolDataSource = () => {
    // read file
    const context = fs.readFileSync(this.geneSymbolFilePath, 'utf8');
    const lines = context.split('\n');

    const dataList: any[] = [];

    for (const line of lines) {
      // line space
      if (!line || line === '') continue;

      //ignore a commented line
      if (line.charAt(0) === '#') continue;

      const columns = line.split('\t');

      const gene_symbol = columns[0],
        gene_id = columns[1];

      if (gene_symbol && gene_id) {
        const data = [gene_id, gene_symbol];
        dataList.push(data);
      }
    }

    return dataList;
  };

  async main() {
    console.log(`Mapping ensembl on ${this.reference}`);
    const dataSource = this.mapDataSource();
    await this.createGeneTable();
    await this.addGene(dataSource);
    console.log(`Mapping ensembl on ${this.reference} SUCCESS!!`);
  }
}

const run = () => {
  const ensemblGrch37 = new EnsemblDataSource(
    'grch37',
    '/abolute/file/path/Homo_sapiens.GRCh37.87.chr.gff3',
    '/abolute/file/path/gene_symbol.txt'
  );
  ensemblGrch37.main();

  const ensemblGrch38 = new EnsemblDataSource(
    'grch37',
    '/abolute/file/path/Homo_sapiens.GRCh38.98.chr.gff3',
    '/abolute/file/path/gene_symbol.txt'
  );
  ensemblGrch38.main();
};
