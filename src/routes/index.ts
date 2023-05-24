import type { Request, Response } from 'express';
import express from 'express';
import { ListBucketsCommand } from '@aws-sdk/client-s3';

import database from '../database';
import { s3 } from '../storage';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const db = await database.getDb();
  const result = {
    api_ready: true,
    db_ready: await db.stats(),
    storage_ready: await s3.send(new ListBucketsCommand({})),
  };

  res.send(result);
});

export default router;
