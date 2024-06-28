import { DgvVariantDto } from '../../dto/analysis/dgv-variant.dto';
import * as path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

class DgvAllVariants {
  main = async (referenceGenome: string, sourceFilePath: string) => {
    const outDir = path.join(__dirname, '..', 'dgv_all_varaints');
    this.createDgvFiles(referenceGenome, sourceFilePath, outDir).catch(err =>
      console.log(err)
    );
  };

  createAllKeyChrs() {
    const allKeyChrs: string[] = [];
    for (let i = 1; i < 23; i++) {
      const chr = `chr${i}`;
      allKeyChrs.push(chr);
    }
    allKeyChrs.push('chrX');
    allKeyChrs.push('chrY');
    return allKeyChrs;
  }

  createDgvFiles = async (
    referenceGenome: string,
    sourceFilePath: string,
    outDir: string
  ) => {
    const dgvVariantsList = await this.createDgvChrs(
      referenceGenome,
      sourceFilePath
    );
    const allKeyChrs = this.createAllKeyChrs();
    for (const keyChr of allKeyChrs) {
      const data = JSON.stringify(dgvVariantsList[keyChr] as DgvVariantDto[]);
      const outDirPath = path.join(outDir, referenceGenome);
      const outFilePath = path.join(
        outDirPath,
        `dgv_${keyChr}_all_variants.txt`
      );
      mkdirp.sync(outDirPath);

      fs.writeFileSync(outFilePath, data);
    }
  };

  sortStartEndBp = async (dgvVariants: DgvVariantDto[]) => {
    dgvVariants.sort((a, b) =>
      a.startBp! > b.startBp!
        ? 1
        : a.startBp === b.startBp
        ? a.endBp! > b.endBp!
          ? 1
          : -1
        : -1
    );
  };

  createDgvChrs = async (referenceGenome: string, sourceFilePath: string) => {
    const context = fs.readFileSync(sourceFilePath, 'utf8');
    const lines = context.split('\n');

    // initial chromosomes only 'chr1' to 'chr22' and 'chrX', 'chrY'
    let dgvVariantsList: DgvVariantDto[][] = [];
    const allKeyChrs = this.createAllKeyChrs();
    for (const keyChr of allKeyChrs) {
      dgvVariantsList[keyChr] = [];
    }

    for (let row = 0; row < lines.length; row++) {
      const line = lines[row];
      // column header
      if (row === 0) continue;

      // line space
      if (!line || line === '') continue;

      // ignore a commented line
      if (line.charAt(0) === '#') continue;

      const columns = line.split('\t');

      const variant_accession = columns[0],
        chromosome = `chr${columns[1].toUpperCase()}`,
        start_bp = columns[2],
        end_bp = columns[3],
        variant_type = columns[4],
        variant_subtype = columns[5];

      const data = {
        referenceGenome: referenceGenome,
        chromosome: chromosome,
        startBp: start_bp,
        endBp: end_bp,
        variantAccession: variant_accession,
        variantType: variant_type,
        variantSubtype: variant_subtype
      };

      if (dgvVariantsList[chromosome]) {
        dgvVariantsList[chromosome].push(data);
      }
    }
    return dgvVariantsList;
  };
}

const inDgvSourceDirPath =
  '/Users/saowwapark/Documents/Master_Degree/Thesis/coding/inCNV/6_Datasource/src/dgv-original';
const inDgvGrch37Path = path.join(
  inDgvSourceDirPath,
  'GRCh37_hg19_variants_2016-05-15.txt'
);
const inDgvGrch38Path = path.join(
  inDgvSourceDirPath,
  'GRCh38_hg38_variants_2016-08-31.txt'
);

const dgvAllVariants = new DgvAllVariants();

dgvAllVariants.main('dgv_all_variant_grch37', inDgvGrch37Path);

dgvAllVariants.main('dgv_all_variant_grch38', inDgvGrch38Path);
