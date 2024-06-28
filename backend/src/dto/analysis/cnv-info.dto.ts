import { DgvAnnotationKey } from './../../databases/bio/dto/dgv-annotation.dto';
import { SequenceDto } from './sequence.dto';
import { EnsemblAnnotationDto } from './../../databases/bio/dto/ensembl-annotation.dto';
import { ClinvarAnnotationListDto } from './clinvar-annotation-list.dto';
import { DgvAnnotationDto } from '../../databases/bio/dto/dgv-annotation.dto';

export class CnvInfoDto {
  referenceGenome?: string;
  chromosome?: string;
  cnvType?: string;
  startBp?: number;
  endBp?: number;
  overlaps?: string[];
  dgvs?: DgvAnnotationKey[]; //dgv.variant_accession
  ensembls?: EnsemblAnnotationDto[]; //ensembl.gene_id
  clinvar?: ClinvarAnnotationListDto;
  leftFlanking?: SequenceDto;
  rightFlanking?: SequenceDto;
}
