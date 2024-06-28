import express from 'express';
import { samplesetController } from '../controllers/sampleset.controller';
import { AuthenMiddleware } from '../middleware/authen.middleware';

const router = express.Router();

router
  .get('', samplesetController.getSamplesets)

  .post('', samplesetController.addSampleset)

  .delete('', samplesetController.deleteSamplesets)

  .put('/:samplesetId', samplesetController.editSampleset)

  .get('/id-names', samplesetController.getIdAndName)

  .get('/count-samplesets', samplesetController.countSampleset)

  .get('/find-samplesets', samplesetController.findSamplesets);

export default router;
