import { RegionBpDto } from './../../../dto/basepair.dto';
export class EnsemblAnnotationDto {
  geneId?: string;
  geneSymbol?: string;
  startBp?: number;
  endBp?: number;

  constructor(geneId?, geneSymbol?, startBp?, endBp?) {
    this.geneId = geneId || '';
    this.geneSymbol = geneSymbol || '';
    this.startBp = startBp || undefined;
    this.endBp = endBp || undefined;
  }
}
