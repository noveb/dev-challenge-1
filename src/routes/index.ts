import type { Request, Response } from 'express';
import express from 'express';
import { ListBucketsCommand } from '@aws-sdk/client-s3';

import database from '../database';
import storage from '../storage';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await database.getDb();
    const s3 = await storage.getS3();

    const result = {
      api_ready: true,
      db_ready: await db.stats(),
      storage_ready: await s3.send(new ListBucketsCommand({})),
    };

    return res.send(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

export default router;
