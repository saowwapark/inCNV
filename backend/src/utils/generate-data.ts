import { inCnvPool } from '../config/database.config';
import * as mysql from 'mysql2';

console.log('generate-date.js');

const insertSamplesets = async (start, end) => {
  console.log(`insertSamplesets('${start}, ${end})`);
  const sql = `INSERT INTO incnv.sampleset 
      (name, user_id, description, samples, create_date) 
    VALUES(?, 1, 'Diabetes', '[
      "G2223.remdup.uniqMap.TS.bam", "G2227-PJ.remdup.uniqMap.TS.bam", 
      "G2228-M.remdup.uniqMap.TS.bam", "G2309.remdup.uniqMap.TS.bam", 
      "G2359-BK.remdup.uniqMap.TS.bam", "G2360-M.remdup.uniqMap.TS.bam", 
      "G2516.remdup.uniqMap.TS.bam", "G2996-PD.remdup.uniqMap.TS.bam", 
      "G2997-M.remdup.uniqMap.TS.bam", "G3100.remdup.uniqMap.TS.bam"
    ]' , Now() ); `;

  for (let i = start; i < end; i++) {
    const name = `sampleset${i}`;
    await inCnvPool.query(sql, name);
  }
  console.log('insertSamplesets success');
};

/** Main */
// insertSamplesets(41, 201);
