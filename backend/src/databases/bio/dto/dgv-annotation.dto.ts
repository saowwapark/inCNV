import { RegionBpDto } from './../../../dto/basepair.dto';
export class DgvAnnotationDto {
  variantAccession?: string;
  startBp?: number;
  endBp?: number;
  variantSubtype?: string;

  constructor(
    variantAccession?: string,
    startBp?: number,
    endBp?: number,
    variantSubtype?: string
  ) {
    this.variantAccession = variantAccession || undefined;
    this.startBp = startBp || undefined;
    this.endBp = endBp || undefined;
    this.variantSubtype = variantSubtype || undefined;
  }
}

export class DgvAnnotationKey {
  key: string;
  values: DgvAnnotationDto[];
  constructor(key: string, values: DgvAnnotationDto[]) {
    this.key = key;
    this.values = values;
  }
}

// type variantSubtypeKey =
//   | 'duplication'
//   | 'deletion'
//   | 'gain'
//   | 'loss'
//   | 'gain+loss';

// export type DgvAnnotationKey = {
//   [key in variantSubtypeKey]: DgvAnnotationDto[];
// };

// const annotation = new DgvAnnotationDto();
// let test: DgvAnnotationKey = {
//   duplication: annotation,
//   deletion: annotation,
//   gain: annotation,
//   loss: annotation,
//   'gain+loss': annotation
// };
// console.log(test);

// export interface DgvAnnotationKey {
//   [key: string]: DgvAnnotationDto;
// }

// let test: DgvAnnotationKey = {};
// const annotation = new DgvAnnotationDto();
// annotation.variantAccession = 'variant1';
// test['deletion'] = annotation;
// let test2: DgvAnnotationKey = { duplication: annotation };
// console.log(test['del']);
// console.log(test2['dup']);
