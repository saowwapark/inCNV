export class ClinvarAnnotationListDto {
  omimIds?: string[];
  phenotypes?: string[];
  clinicalSignificances?: string[];
  constructor(omimIds?, phenotypes?, clinicalSignificances?) {
    this.omimIds = omimIds || [];
    this.phenotypes = phenotypes || [];
    this.clinicalSignificances = clinicalSignificances || [];
  }
}
