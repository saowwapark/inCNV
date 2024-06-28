import express from 'express';
import { analysisController } from '../controllers/analysis.controller';
const router = express.Router();
import timeout from 'connect-timeout';
router
  .get('/samplesets', analysisController.getSamplesetsToAnalyze)
  .get('/upload-cnv-tool-results', analysisController.getUploadCnvToolResults)
  .get('/dgvs', analysisController.getDgvAllVariants)
  .post(
    '/individual-sample',
    timeout('600s'),
    analysisController.getIndividualSample
  )
  .post('/multiple-sample', analysisController.getMultipleSample)
  // .post('/cnv-infos', analysisController.updateCnvInfos)
  .post('/cnv-info', analysisController.getCnvInfo)
  .post('/download/cnv-infos', analysisController.exportCnvInfos);

export default router;
