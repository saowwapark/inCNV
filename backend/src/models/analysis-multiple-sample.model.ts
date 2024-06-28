import { RegionBpDto } from '../dto/basepair.dto';

import { reformatCnvToolResultDao } from '../databases/incnv/dao/reformat-cnv-tool-result.dao';
import { UploadCnvToolResultDto } from '../databases/incnv/dto/upload-cnv-tool-result.dto';
import { analysisModel } from './analysis.model';
import { CnvGroupDto } from '../dto/analysis/cnv-group.dto';
import { BpGroup } from '../dto/analysis/bp-group';
import { IndexedFasta } from './read-reference-genome/indexed-fasta';
/**
 * Multiple samples in one CNV tool result
 */

export class AnalysisMultipleSampleModel {
  public annotate = async (
    referenceGenome: string,
    chromosome: string,
    cnvType: string,
    samples: string[],
    uploadCnvToolResult: UploadCnvToolResultDto
  ): Promise<[CnvGroupDto[], CnvGroupDto]> => {
    const indexedFasta = analysisModel.createIndexedFasta(referenceGenome);
    const sampleBpGroups: BpGroup[] = await this.getSampleBpGroups(
      uploadCnvToolResult!.uploadCnvToolResultId!,
      samples,
      cnvType,
      chromosome
    );

    const [
      annotatedMultipleSamples,
      annotatedMergedSample
    ] = await Promise.all([
      this.annotateMultipleSamples(
        referenceGenome,
        chromosome,
        cnvType,
        sampleBpGroups,
        indexedFasta
      ),
      analysisModel.annotateMergedBpGroup(
        referenceGenome,
        chromosome,
        cnvType,
        sampleBpGroups,
        indexedFasta
      )
    ]);
    indexedFasta.closeFiles();
    return [annotatedMultipleSamples, annotatedMergedSample];
  };

  private annotateSample = async (
    referenceGenome: string,
    chromosome: string,
    cnvType: string,
    sampleBpGroup: BpGroup,
    indexedFasta: IndexedFasta
  ): Promise<CnvGroupDto> => {
    console.log('group name: ' + sampleBpGroup.groupName);
    console.log('basepair numbers: ' + sampleBpGroup.basepairs.length);
    const sampleAnnotation = await analysisModel.generateCnvInfos(
      referenceGenome,
      chromosome,
      cnvType,
      sampleBpGroup.basepairs!,
      indexedFasta
    );
    const annotatedSample: CnvGroupDto = {
      cnvGroupName: sampleBpGroup.groupName,
      cnvInfos: sampleAnnotation
    };

    return annotatedSample;
  };

  public annotateMultipleSamples = async (
    referenceGenome: string,
    chromosome: string,
    cnvType: string,
    sampleBpGroups: BpGroup[],
    indexedFasta: IndexedFasta
  ) => {
    // add annotation of all samples
    const annotatedSamples: Promise<CnvGroupDto[]> = Promise.all(
      sampleBpGroups.map(sampleBpGroup => {
        return this.annotateSample(
          referenceGenome,
          chromosome,
          cnvType,
          sampleBpGroup,
          indexedFasta
        );
      })
    );
    return annotatedSamples;
  };

  public getSampleBpGroup = async (
    uploadCnvToolResultId: number,
    sample: string,
    cnvType: string,
    chromosome: string
  ): Promise<BpGroup> => {
    let bps: RegionBpDto[] = await reformatCnvToolResultDao.getBasepairs(
      uploadCnvToolResultId,
      sample,
      cnvType,
      chromosome
    );
    const sampleBpGroup: BpGroup = {
      groupName: sample,
      basepairs: bps
    };

    return sampleBpGroup;
  };

  /**
   * get Basepairs of all samples
   */
  public getSampleBpGroups = async (
    uploadCnvToolResultId: number,
    samples: string[],
    cnvType: string,
    chromosome: string
  ): Promise<BpGroup[]> => {
    const sampleBpGroups: Promise<BpGroup[]> = Promise.all(
      samples.map(sample => {
        return this.getSampleBpGroup(
          uploadCnvToolResultId,
          sample,
          cnvType,
          chromosome
        );
      })
    );
    return sampleBpGroups;
  };
}
export const analysisMultipleSampleModel = new AnalysisMultipleSampleModel();
