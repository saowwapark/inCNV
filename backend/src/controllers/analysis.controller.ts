import { IndexedFasta } from './../models/read-reference-genome/indexed-fasta';
import { DgvVariantDto } from './../dto/analysis/dgv-variant.dto';
import { analysisIndividualSampleModel } from '../models/analysis-individual-sample.model';
import { analysisModel } from './../models/analysis.model';
import { userService } from '../services/user.service';
import * as express from 'express';
import { analysisResultModel } from '../models/analysis-result.model';
import { CnvInfoDto } from '../dto/analysis/cnv-info.dto';
import { analysisMultipleSampleModel } from '../models/analysis-multiple-sample.model';
export class AnalysisController {
  public getSamplesetsToAnalyze = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = userService.getUserId(req);
      const samplesets = await analysisModel.getSamplesetsToAnalyze(userId!);
      res.status(200).json({
        payload: samplesets
      });
    } catch (err) {
      next(err);
    }
  };

  public getUploadCnvToolResults = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const referenceGenome = req.query.referenceGenome,
        samplesetId = req.query.samplesetId;

      const uploadCnvToolResults = await analysisModel.getUploadCnvToolResultToChoose(
        referenceGenome,
        samplesetId
      );
      res.status(200).json({
        payload: uploadCnvToolResults
      });
    } catch (err) {
      next(err);
    }
  };

  public getDgvAllVariants = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const referenceGenome = req.query.referenceGenome;
      const chromosome = req.query.chromosome;
      const dgvAllVariants: DgvVariantDto[] = analysisModel.getDgvAllVarirants(
        referenceGenome,
        chromosome
      );

      res.status(200).json({
        payload: dgvAllVariants
      });
    } catch (err) {
      next(err);
    }
  };
  public getMultipleSample = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const referenceGenome = req.body.referenceGenome;
      const cnvType = req.body.cnvType;
      const chromosome = req.body.chromosome;
      const uploadCnvToolResult = req.body.uploadCnvToolResult;
      const samples = req.body.samples;

      const [
        annotatedSelectedSamples,
        annotatedMergedSample
      ] = await analysisMultipleSampleModel.annotate(
        referenceGenome,
        chromosome,
        cnvType,
        samples,
        uploadCnvToolResult
      );

      res.status(200).json({
        payload: [annotatedSelectedSamples, annotatedMergedSample]
      });
    } catch (err) {
      next(err);
    }
  };

  public getIndividualSample = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      console.log('getIndividualSample');
      const referenceGenome = req.body.referenceGenome;
      const cnvType = req.body.cnvType;
      const chromosome = req.body.chromosome;
      const uploadCnvToolResults = req.body.uploadCnvToolResults;
      const sample = req.body.sample;

      const [
        annotatedSelectedCnvTools,
        annotatedMergedCnvTool
      ] = await analysisIndividualSampleModel.annotate(
        referenceGenome,
        chromosome,
        cnvType,
        sample,
        uploadCnvToolResults
      );
      console.log(
        '-------------------------- annotate success!!----------------------'
      );
      res.status(200).json({
        payload: [annotatedSelectedCnvTools, annotatedMergedCnvTool]
      });
      // next();
    } catch (err) {
      console.error('getIndividualSample err!!!');
      next(err);
    }
  };

  // public updateCnvInfos = async (
  //   req: express.Request,
  //   res: express.Response,
  //   next: express.NextFunction
  // ) => {
  //   try {
  //     const cnvInfos: CnvInfoDto[] = req.body;
  //     const indexedFasta = analysisModel.createIndexedFasta(cnvInfo.referenceGenome!);
  //     for (const cnvInfo of cnvInfos) {
  //       [
  //         cnvInfo.ensembls,
  //         cnvInfo.dgvs,
  //         cnvInfo.clinvar
  //       ] = await analysisModel.getCnvAnnotations(cnvInfo);
  //     }
  //     res.status(200).json({
  //       payload: cnvInfos
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // };

  public getCnvInfo = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const cnvInfo: CnvInfoDto = req.body;
      const indexedFasta: IndexedFasta = analysisModel.createIndexedFasta(
        cnvInfo.referenceGenome!
      );
      [
        cnvInfo.ensembls,
        cnvInfo.dgvs,
        cnvInfo.clinvar
      ] = await analysisModel.getCnvAnnotations(cnvInfo, indexedFasta);

      indexedFasta.closeFiles();
      res.status(200).json({
        payload: cnvInfo
      });
    } catch (err) {
      next(err);
    } finally {
    }
  };

  public exportCnvInfos = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const cnvInfos: CnvInfoDto[] = req.body;

      const dataFile = analysisResultModel.createDataFile(cnvInfos);
      res.contentType('text/plain');
      res.set({
        'Content-Disposition': 'attachment; filename=name.txt'
      });
      res.send(dataFile);
    } catch (err) {
      next(err);
    }
  };
}

export const analysisController = new AnalysisController();
