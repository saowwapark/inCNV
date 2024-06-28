import path from 'path';

// /backend/volumes/datasources_volume/datasources-version.json
// /backend/src/tmp

// root level
export const ROOT_DIR_PATH = path.join(__dirname, '..', '..');

// level 1
export const VOLUMES_DIR_PATH = path.join(ROOT_DIR_PATH, 'volumes');
export const SRC_DIR_PATH = path.join(ROOT_DIR_PATH, 'src');

// level 2
export const TMP_DIR_PATH = path.join(SRC_DIR_PATH, 'tmp');
export const STATIC_DIR_PATH = path.join(SRC_DIR_PATH, 'public');

// level 3
export const UPLOADED_CNV_RESULTS_TMP_DIR_PATH = path.join(TMP_DIR_PATH, 'uploaded_cnv_results');
export const DATASOURCES_TMP_DIR_PATH = path.join(TMP_DIR_PATH, 'datasources');
export const DATASOURCES_VOLUME_DIR_PATH = path.join(VOLUMES_DIR_PATH,
  'datasources_volume');
  export const RESULTS_VOLUME_DIR_PATH = path.join(
  VOLUMES_DIR_PATH,
  'results_volume'
);

// level 4
export const  DATASOURCES_VERSION_PATH = path.join(
  DATASOURCES_VOLUME_DIR_PATH,
  'datasources_version.json'
);
export const DATASOURCES_ORIGINAL_VERSION_PATH = path.join(
  
   SRC_DIR_PATH, 'datasources',
  'datasources_version_original.json'
);
export const REF_GENOME_DIR_PATH = path.join(
  DATASOURCES_VOLUME_DIR_PATH,
  'reference_genome'
);
export const REF_GENOME_GRCH37_FASTA_PATH = path.join(
  REF_GENOME_DIR_PATH,
  'reference_genome_grch37.fa'
);
export const DGV_DIR_PATH = path.join(
  DATASOURCES_VOLUME_DIR_PATH,
  'dgv_all_variants'
);

// level 5
export const REF_GENOME_GRCH37_FAI_PATH = path.join(
  REF_GENOME_DIR_PATH,
  'reference_genome_grch37.fa.fai'
);
export const REF_GENOME_GRCH38_FASTA_PATH = path.join(
  REF_GENOME_DIR_PATH,
  'reference_genome_grch38.fa'
);
export const REF_GENOME_GRCH38_FAI_PATH = path.join(
  REF_GENOME_DIR_PATH,
  'reference_genome_grch38.fa.fai'
);
export const DGV_GRCH37_DIR_PATH = path.join(
  DGV_DIR_PATH,
  'dgv_all_variants_grch37'
);
export const DGV_GRCH38_DIR_PATH = path.join(
  DGV_DIR_PATH,
  'dgv_all_variants_grch38'
);
