import { Request, Response, NextFunction } from 'express'
import { createDatabase } from '../datasources/scripts/create-database';
import { databases } from '../datasources/scripts/database-const';
import { updateDatabase } from '../datasources/scripts/update-database';
import { updateDgvAllVariants } from '../datasources/scripts/update-dgv-all-varaint';
import { updateReferenceGenomeGrch37 } from '../datasources/scripts/update-reference-genome-grch37';
import { updateReferenceGenomeGrch38 } from '../datasources/scripts/update-reference-genome-grch38';
import { utilityDatasource } from '../datasources/scripts/utility-datasource';
import { DATASOURCES_TMP_DIR_PATH } from '../config/path.config';

export class DatasourceController {

    public isShouldUpdateDatasource = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const originalVersion = utilityDatasource.getDatasourceOriginalVersion();
        const currentVersion = utilityDatasource.getDatasourceVersion();
        res.status(200).json({ payload: originalVersion === currentVersion });
    }

    public updateDatasource = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const headers = {
            'Content-Type': 'text/event-stream',
            Connection: 'keep-alive',
            'Cache-Control': 'no-cache'
        };
        res.writeHead(200, headers);

        try {
            res.write(`data: -------------- START SETUP inCNV ---------------\n\n`)
            res.write(`data: 1. Create Database\n\n`)
            const createDbLog = await createDatabase.crateDb(databases);
            console.log(createDbLog);
            res.write(`data: ${JSON.stringify(createDbLog)}\n\n`);

            res.write(`data: 2. Download Clinvar and DGV Varaints\n\n`)
            const updateDbLog = await updateDatabase.main();
            console.log(updateDbLog);
            res.write(`data: ${JSON.stringify(updateDbLog)}\n\n`);

            res.write(`data: 3. Download Dgv All Variants\n\n`)
            const updateDgvAllVariantsLog = await updateDgvAllVariants.main();
            console.log(updateDgvAllVariantsLog);
            res.write(`data: ${JSON.stringify(updateDgvAllVariantsLog)}\n\n`);

            res.write(`data: 4. Download Reference Genome Grch37\n\n`)
            const updateReferenceGenomeGrch37Log = await updateReferenceGenomeGrch37.main();
            console.log(updateReferenceGenomeGrch37Log);
            res.write(`data: ${JSON.stringify(updateReferenceGenomeGrch37Log)}\n\n`);

            res.write(`data: 5. Download Reference Genome Grch38\n\n`)
            const updateReferenceGenomeGrch38Log = await updateReferenceGenomeGrch38.main();
            console.log(updateReferenceGenomeGrch38Log);
            res.write(`data: ${JSON.stringify(updateReferenceGenomeGrch38Log)}\n\n`);

            utilityDatasource.deleteFiles(DATASOURCES_TMP_DIR_PATH);

            res.write(`data: -------------- FINISH SETUP inCNV ---------------\n\n`)
            res.end()
        } catch (err) {
            console.error(err);
            const originalVersion = utilityDatasource.getDatasourceOriginalVersion();
            utilityDatasource.writeDatasourceVersion(originalVersion);
            const url = 'https://github.com/saowwapark/inCNV'
            res.write(`data: Some errors happen. Plese check environment configuration here, ${url}\n\n`);
            res.end();
        }

    }
}

export const datasourceController = new DatasourceController();