import express from "express";
import { datasourceController } from "../controllers/datasource.controller";

const router = express.Router();

router.get('/check-updated-datasource', datasourceController.isShouldUpdateDatasource)
router.get('/update-datasource', datasourceController.updateDatasource)
export default router;