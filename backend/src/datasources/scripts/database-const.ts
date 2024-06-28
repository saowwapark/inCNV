export interface DatabaseScript {
  databaseName: string;
  tables: TableScript[];
}

export interface TableScript {
  tableName: string;
  createSql: string;
  insertSql?: string;
}

const inCnvDatabase: DatabaseScript = {
  databaseName: 'inCNV',
  tables: [
    {
      tableName: 'user',
      createSql: `CREATE TABLE IF NOT EXISTS inCNV.user (
                  user_id int(11) unsigned NOT NULL AUTO_INCREMENT,
                  email varchar(255) NOT NULL,
                  password varchar(255) NOT NULL,
                  create_date datetime DEFAULT NULL,
                  modify_date datetime DEFAULT NULL,
                  PRIMARY KEY (user_id),
                  UNIQUE KEY email (email)
                ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`
    },
    {
      tableName: 'sampleset',
      createSql: `CREATE TABLE IF NOT EXISTS inCNV.sampleset (
                  sampleset_id int(11) unsigned NOT NULL AUTO_INCREMENT,
                  user_id int(11) unsigned DEFAULT NULL,
                  sampleset_name varchar(45) DEFAULT NULL,
                  description varchar(128) DEFAULT NULL,
                  samples json DEFAULT NULL,
                  create_date datetime DEFAULT NULL,
                  modify_date datetime DEFAULT NULL,
                  PRIMARY KEY (sampleset_id)
                ) ENGINE=InnoDB  DEFAULT CHARSET=latin1;`
    },
    {
      tableName: 'tab_file_mapping',
      createSql: `CREATE TABLE IF NOT EXISTS inCNV.tab_file_mapping (
                  tab_file_mapping_id int(11) NOT NULL AUTO_INCREMENT,
                  user_id int(11) DEFAULT NULL,
                  tab_file_mapping_name varchar(45) DEFAULT NULL,
                  sample varchar(128) DEFAULT NULL,
                  chromosome varchar(45) DEFAULT NULL,
                  start_bp varchar(45) DEFAULT NULL,
                  end_bp varchar(45) DEFAULT NULL,
                  cnv_type varchar(45) DEFAULT NULL,
                  chromosome_22 varchar(45) DEFAULT NULL,
                  duplication varchar(45) DEFAULT NULL,
                  deletion varchar(45) DEFAULT NULL,
                  create_date datetime DEFAULT NULL,
                  modify_date datetime DEFAULT NULL,
                  PRIMARY KEY (tab_file_mapping_id)
                ) ENGINE=InnoDB  DEFAULT CHARSET=latin1;`
    },

    {
      tableName: 'upload_cnv_tool_result',
      createSql: `CREATE TABLE IF NOT EXISTS inCNV.upload_cnv_tool_result (
                  upload_cnv_tool_result_id int(11) unsigned NOT NULL AUTO_INCREMENT,
                  user_id int(11) unsigned DEFAULT NULL,
                  sampleset_id int(11) unsigned DEFAULT NULL,
                  tab_file_mapping_id int(11) unsigned DEFAULT NULL,
                  file_name varchar(128) DEFAULT NULL,
                  file_info varchar(128) DEFAULT NULL,
                  cnv_tool_name varchar(45) DEFAULT NULL,
                  reference_genome varchar(45) DEFAULT NULL,
                  tag_descriptions json DEFAULT NULL,
                  create_date datetime DEFAULT NULL,
                  modify_date datetime DEFAULT NULL,
                  PRIMARY KEY (upload_cnv_tool_result_id)
                ) ENGINE=InnoDB  DEFAULT CHARSET=latin1;`
    },
    {
      tableName: 'reformat_cnv_tool_result',
      createSql: `CREATE TABLE IF NOT EXISTS inCNV.reformat_cnv_tool_result (
                  reformat_cnv_tool_result_id int(11) unsigned NOT NULL AUTO_INCREMENT,
                  upload_cnv_tool_result_id int(11) unsigned NOT NULL,
                  sample varchar(45) DEFAULT NULL,
                  chromosome varchar(45) DEFAULT NULL,
                  start_bp int(11) DEFAULT NULL,
                  end_bp int(11) DEFAULT NULL,
                  cnv_type varchar(45) DEFAULT NULL,
                  PRIMARY KEY (reformat_cnv_tool_result_id),
                  KEY upload_cnv_tool_result_id (upload_cnv_tool_result_id),
                  FOREIGN KEY (upload_cnv_tool_result_id)
                        REFERENCES upload_cnv_tool_result(upload_cnv_tool_result_id)
                        ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`
    }
  ]
};

const bioGrch37Database: DatabaseScript = {
  databaseName: 'bio_grch37',
  tables: [
    {
      tableName: 'clinvar',
      createSql: `CREATE TABLE IF NOT EXISTS bio_grch37.clinvar (
                  clinvar_id int(3) unsigned NOT NULL,
                  allele_id int(11) DEFAULT NULL,
                  type varchar(45) DEFAULT NULL,
                  name varchar(800),
                  gene_id varchar(45) DEFAULT NULL,
                  gene_symbol varchar(700),
                  hgnc_id varchar(45) DEFAULT NULL,
                  clinical_significance varchar(128) DEFAULT NULL,
                  last_evaluated varchar(45) DEFAULT NULL,
                  rs_dbSNP varchar(45) DEFAULT NULL,
                  omim_id_list varchar(255),
                  phenotype_list varchar(1300),
                  chromosome varchar(5)  NOT NULL,
                  start_bp int(4) unsigned NOT NULL,
                  end_bp int(4) unsigned NOT NULL,
                  cytogenetic varchar(45) DEFAULT NULL,
                  PRIMARY KEY (clinvar_id),
                  KEY end_bp (end_bp),
                  KEY start_bp (start_bp)
                ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`,
      insertSql: `INSERT INTO bio_grch37.clinvar (
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
                  cytogenetic) VALUES ?`
    },
    {
      tableName: 'dgv',
      createSql: `CREATE TABLE IF NOT EXISTS bio_grch37.dgv (
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
                  PRIMARY KEY (variant_accession),
                  KEY end_bp (end_bp),
                  KEY start_bp (start_bp)
                ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`,
      insertSql: `INSERT INTO bio_grch37.dgv (
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
                  ) VALUES ?`
    },
    {
      tableName: 'ensembl',
      createSql: `CREATE TABLE IF NOT EXISTS bio_grch37.ensembl (
                  gene_id VARCHAR(15) NOT NULL,
                  gene_type VARCHAR(45) NULL,
                  gene_symbol VARCHAR(45),
                  chromosome VARCHAR(10) NULL,
                  start_bp INT(10) NULL,
                  end_bp INT(10) NULL,
                  PRIMARY KEY (gene_id),
                  KEY end_bp (end_bp),
                  KEY start_bp (start_bp)
                ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`,
      insertSql: `INSERT INTO bio_grch37.ensembl (
                  gene_id, 
                  gene_type, 
                  gene_symbol, 
                  chromosome, 
                  start_bp, 
                  end_bp
                  ) VALUES ?`
    }
  ]
};

const bioGrch38Database: DatabaseScript = {
  databaseName: 'bio_grch38',
  tables: [
    {
      tableName: 'clinvar',
      createSql: `CREATE TABLE IF NOT EXISTS bio_grch38.clinvar (
                  clinvar_id int(3) unsigned NOT NULL,
                  allele_id int(11) DEFAULT NULL,
                  type varchar(45) DEFAULT NULL,
                  name varchar(800),
                  gene_id varchar(45) DEFAULT NULL,
                  gene_symbol varchar(700),
                  hgnc_id varchar(45) DEFAULT NULL,
                  clinical_significance varchar(128) DEFAULT NULL,
                  last_evaluated varchar(45) DEFAULT NULL,
                  rs_dbSNP varchar(45) DEFAULT NULL,
                  omim_id_list varchar(255),
                  phenotype_list varchar(1300),
                  chromosome varchar(5)  NOT NULL,
                  start_bp int(4) unsigned NOT NULL,
                  end_bp int(4) unsigned NOT NULL,
                  cytogenetic varchar(45) DEFAULT NULL,
                  PRIMARY KEY (clinvar_id),
                  KEY end_bp (end_bp),
                  KEY start_bp (start_bp)
                ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`,
      insertSql: `INSERT INTO bio_grch38.clinvar ( 
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
                  cytogenetic) VALUES ?`
    },
    {
      tableName: 'dgv',
      createSql: `CREATE TABLE IF NOT EXISTS bio_grch38.dgv (
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
                  PRIMARY KEY (variant_accession),
                  KEY end_bp (end_bp),
                  KEY start_bp (start_bp)
                ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`,
      insertSql: `INSERT INTO bio_grch38.dgv (
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
                  ) VALUES ?`
    },
    {
      tableName: 'ensembl',
      createSql: `CREATE TABLE IF NOT EXISTS bio_grch38.ensembl (
                  gene_id VARCHAR(15) NOT NULL,
                  gene_type VARCHAR(45) NULL,
                  gene_symbol VARCHAR(45),
                  chromosome VARCHAR(10) NULL,
                  start_bp INT(10) NULL,
                  end_bp INT(10) NULL,
                  PRIMARY KEY (gene_id),
                  KEY end_bp (end_bp),
                  KEY start_bp (start_bp)
                ) ENGINE=InnoDB DEFAULT CHARSET=latin1;`,
      insertSql: `INSERT INTO bio_grch38.ensembl (
                  gene_id, 
                  gene_type, 
                  gene_symbol, 
                  chromosome, 
                  start_bp, 
                  end_bp
                  ) VALUES ?`
    }
  ]
};

export const databases: DatabaseScript[] = [
  inCnvDatabase,
  bioGrch37Database,
  bioGrch38Database
];
