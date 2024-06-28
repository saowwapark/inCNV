export class Chromosome {
  name: string;
  length: number; // basepair
  constructor(name: string, length: number) {
    this.name = name;
    this.length = length;
  }
}

/**
 * Reference Data Source: https://en.wikipedia.org/wiki/Human_genome
 * Ensembl database at the European Bioinformatics Institute (EBI) and Wellcome Trust Sanger Institute
 */
export const HUMAN_CHROMOSOME: any = {};

HUMAN_CHROMOSOME.chr1 = new Chromosome('1', 248956422);
HUMAN_CHROMOSOME.chr2 = new Chromosome('2', 242193529);
HUMAN_CHROMOSOME.chr3 = new Chromosome('3', 198295559);
HUMAN_CHROMOSOME.chr4 = new Chromosome('4', 190214555);
HUMAN_CHROMOSOME.chr5 = new Chromosome('5', 181538259);
HUMAN_CHROMOSOME.chr6 = new Chromosome('6', 170805979);
HUMAN_CHROMOSOME.chr7 = new Chromosome('7', 159345973);
HUMAN_CHROMOSOME.chr8 = new Chromosome('8', 145138636);
HUMAN_CHROMOSOME.chr9 = new Chromosome('9', 138394717);
HUMAN_CHROMOSOME.chr10 = new Chromosome('10', 133797422);
HUMAN_CHROMOSOME.chr11 = new Chromosome('11', 135086622);
HUMAN_CHROMOSOME.chr12 = new Chromosome('12', 133275309);
HUMAN_CHROMOSOME.chr13 = new Chromosome('13', 114364328);
HUMAN_CHROMOSOME.chr14 = new Chromosome('14', 107043718);
HUMAN_CHROMOSOME.chr15 = new Chromosome('15', 101991189);
HUMAN_CHROMOSOME.chr16 = new Chromosome('16', 90338345);
HUMAN_CHROMOSOME.chr17 = new Chromosome('17', 83257441);
HUMAN_CHROMOSOME.chr18 = new Chromosome('18', 80373285);
HUMAN_CHROMOSOME.chr19 = new Chromosome('19', 58617616);
HUMAN_CHROMOSOME.chr20 = new Chromosome('20', 64444167);
HUMAN_CHROMOSOME.chr21 = new Chromosome('21', 46709983);
HUMAN_CHROMOSOME.chr22 = new Chromosome('22', 50818468);
HUMAN_CHROMOSOME.chrX = new Chromosome('x', 156040895);
HUMAN_CHROMOSOME.chrY = new Chromosome('y', 57227415);
