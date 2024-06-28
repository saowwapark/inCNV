import { IndexedFasta } from './read-reference-genome/indexed-fasta';
import { RegionBpDto } from './../dto/basepair.dto';
/**
 * Shared individual sample from multiple CNV tool results
 */
import { analysisModel } from './analysis.model';
import pLimit from 'p-limit';

import { reformatCnvToolResultDao } from '../databases/incnv/dao/reformat-cnv-tool-result.dao';
import { UploadCnvToolResultDto } from '../databases/incnv/dto/upload-cnv-tool-result.dto';
import { CnvGroupDto } from '../dto/analysis/cnv-group.dto';
import { BpGroup } from '../dto/analysis/bp-group';
import { CnvInfoDto } from '../dto/analysis/cnv-info.dto';
import { AnnotationStoredproc } from '../databases/bio/dao/annotation-storedproc.dao';
import { ClinvarDto } from '../databases/bio/dto/clinvar.dto';
import { MergedBasepairDto } from '../dto/analysis/merged-basepair.dto';
import { mergedBasepairModel } from './merged-basepair.model';
import { MERGED_RESULT_NAME } from '../dto/analysis/constants';

// const limit = pLimit(3);

export class AnalysisIndividualSampleModel {
  constructor() {}

  public annotateToolFromStoredproc = async (
    userId: number,
    referenceGenome: string,
    cnvType: string,
    chromosome: string,
    bpGroup: BpGroup
  ) => {
    const annotationStoredproc = new AnnotationStoredproc(referenceGenome);
    const bps = bpGroup.basepairs;

    const rows = await annotationStoredproc.getAnnotations(
      userId,
      cnvType,
      chromosome,
      bps
    );
    const cnvInfos: CnvInfoDto[] = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cnvInfo: CnvInfoDto = new CnvInfoDto();
      cnvInfo.referenceGenome = referenceGenome;
      cnvInfo.chromosome = chromosome;
      cnvInfo.cnvType = cnvType;
      cnvInfo.startBp = bps[i].startBp;
      cnvInfo.endBp = bps[i].endBp;
      cnvInfo.dgvs = row.dgvAnnotations;
      cnvInfo.ensembls = row.ensemblAnnotations;
      // modify clinvar
      const clinvars = row.clinvarAnnotations as ClinvarDto[];
      cnvInfo.clinvar = analysisModel.mergedClinvarAnnotations(clinvars);

      cnvInfos.push(cnvInfo);
    }
    const annotatedTool: CnvGroupDto = {
      cnvGroupName: bpGroup.groupName,
      cnvInfos: cnvInfos
    };
    return annotatedTool;
  };

  // public annotate = async (
  //   userId: number,
  //   referenceGenome: string,
  //   chromosome: string,
  //   cnvType: string,
  //   sample: string,
  //   uploadCnvToolResults: UploadCnvToolResultDto[]
  // ): Promise<[CnvGroupDto[], CnvGroupDto]> => {

  // const toolBpGroups = await this.getToolBpGroups(
  //   chromosome,
  //   cnvType,
  //   sample,
  //   uploadCnvToolResults
  // );

  // // annotate multiple tools
  // const annotatedMultipleTools: CnvGroupDto[] = await Promise.all(
  //   toolBpGroups.map(bpGroup => {
  //     return this.annotateToolFromStoredproc(
  //       userId,
  //       referenceGenome,
  //       cnvType,
  //       chromosome,
  //       bpGroup
  //     );
  //   })
  // );

  // // annotate merged tool
  // const mergedBps: MergedBasepairDto[] = mergedBasepairModel.mergeBpGroups(
  //   toolBpGroups
  // );

  // const annotatedMergedTool: CnvGroupDto = await this.annotateToolFromStoredproc(
  //   userId,
  //   referenceGenome,
  //   cnvType,
  //   chromosome,
  //   new BpGroup(MERGED_RESULT_NAME, mergedBps)
  // );

  // return [annotatedMultipleTools, annotatedMergedTool];
  // }

  public annotate = async (
    referenceGenome: string,
    chromosome: string,
    cnvType: string,
    sample: string,
    uploadCnvToolResults: UploadCnvToolResultDto[]
  ): Promise<[CnvGroupDto[], CnvGroupDto]> => {
    console.log('-------- annotate --------');

    const indexedFasta: IndexedFasta = analysisModel.createIndexedFasta(
      referenceGenome
    );
    const toolBpGroups = await this.getToolBpGroups(
      chromosome,
      cnvType,
      sample,
      uploadCnvToolResults
    );

    const [annotatedMultipleTools, annotatedMergedTool] = await Promise.all([
      // limit(() => {
      //   return this.annotateMultipleTools(
      //     referenceGenome,
      //     chromosome,
      //     cnvType,
      //     toolBpGroups
      //   );
      // }),
      // limit(() => {
      //   return analysisModel.annotateMergedBpGroup(
      //     referenceGenome,
      //     chromosome,
      //     cnvType,
      //     toolBpGroups
      //   );
      // })
      this.annotateMultipleTools(
        referenceGenome,
        chromosome,
        cnvType,
        toolBpGroups,
        indexedFasta
      ),

      analysisModel.annotateMergedBpGroup(
        referenceGenome,
        chromosome,
        cnvType,
        toolBpGroups,
        indexedFasta
      )
    ]);
    indexedFasta.closeFiles();
    return [annotatedMultipleTools, annotatedMergedTool];
  };

  private getToolBpGroup = async (
    chromosome: string,
    cnvType: string,
    sample: string,
    uploadCnvToolResult: UploadCnvToolResultDto
  ): Promise<BpGroup> => {
    const regionBps = await reformatCnvToolResultDao.getBasepairs(
      uploadCnvToolResult.uploadCnvToolResultId,
      sample,
      cnvType,
      chromosome
    );
    const toolBpGroup: BpGroup = {
      groupName: `${uploadCnvToolResult.cnvToolName}_${uploadCnvToolResult.fileInfo}`,
      basepairs: regionBps
    };
    return toolBpGroup;
  };
  public getToolBpGroups = async (
    chromosome: string,
    cnvType: string,
    sample: string,
    uploadCnvToolResults: UploadCnvToolResultDto[]
  ): Promise<BpGroup[]> => {
    console.log('-- getToolBpGroups');
    const toolBpGroups: Promise<BpGroup[]> = Promise.all(
      uploadCnvToolResults.map(upload => {
        return this.getToolBpGroup(chromosome, cnvType, sample, upload);
      })
    );

    return toolBpGroups;
  };

  private annotateTool = async (
    referenceGenome: string,
    chromosome: string,
    cnvType: string,
    toolBpGroup: BpGroup,
    indexedFasta: IndexedFasta
  ): Promise<CnvGroupDto> => {
    console.log('group name: ' + toolBpGroup.groupName);
    console.log('basepair numbers: ' + toolBpGroup.basepairs.length);
    const cnvInfos: CnvInfoDto[] = await analysisModel.generateCnvInfos(
      referenceGenome,
      chromosome,
      cnvType,
      toolBpGroup.basepairs!,
      indexedFasta
    );
    const annotatedTool: CnvGroupDto = {
      cnvGroupName: toolBpGroup.groupName,
      cnvInfos: cnvInfos
    };
    return annotatedTool;
  };

  /**
   *  Annotate Multiple Tools
   */
  public annotateMultipleTools = async (
    referenceGenome: string,
    chromosome: string,
    cnvType: string,
    toolBpGroups: BpGroup[],
    indexedFasta: IndexedFasta
  ): Promise<CnvGroupDto[]> => {
    console.log('-- annotateMultipleTools');
    const annotatedTools: Promise<CnvGroupDto[]> = Promise.all(
      toolBpGroups.map(toolBpGroup => {
        return this.annotateTool(
          referenceGenome,
          chromosome,
          cnvType,
          toolBpGroup,
          indexedFasta
        );
      })
    );

    return annotatedTools;
  };
}

export const analysisIndividualSampleModel = new AnalysisIndividualSampleModel();
